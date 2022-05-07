import { program, InvalidOptionArgumentError } from 'commander'
import * as dotenv from 'dotenv'
import { TwitterApi, ETwitterStreamEvent, TweetStream } from 'twitter-api-v2'
import * as nsfwjs from 'nsfwjs'
import * as tf from '@tensorflow/tfjs-node'
import Jimp = require('jimp');
dotenv.config()

; (async () => {
  program.version('1.0.0');

  program
    .option('-o, --outDir <path>', 'the out directory for pictures')
    .option('-c, --count <count>', 'the amount of pictures to get', myParseInt)

  program.parseAsync().then(async (prgrm) => {
    const opts = prgrm.opts()
    if (!(opts.outDir && opts.count)) {
      throw Error("Error in input")
    }

    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)
    // console.log("file://"+__dirname +"/model/")
    // @ts-ignore
    // const model = await nsfwjs.load("file:/"+__dirname +"/model/", {type: "graph"})
    const model = await nsfwjs.load()
    new PictureSampler(client, opts.count, opts.outDir, model)
  })

})();

function myParseInt(value: any): number {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidOptionArgumentError('Not a number.');
  }
  return parsedValue;
}

async function downloadJimpImg(url: string): Promise<Jimp> {
  const jbuff = await Jimp.read(url)
  return jbuff
}

interface NSFWModel {
  classify: (img: any) => Promise<any>
}

class PictureSampler {
  amount: number
  stream: TweetStream
  outdir: string
  i: number
  hashes: string[]
  imgUrls: string[]
  currentlyDownloading: number = 0
  maxImgUrlStack: number = 200
  maxDownloadStack: number = 8
  nsfwModel: NSFWModel

  constructor(client: TwitterApi, amount: number, outdir: string, nsfwModel: any) {
    this.amount = amount
    this.outdir = outdir
    this.hashes = []
    this.imgUrls = []
    this.i = 0
    this.nsfwModel = nsfwModel
    this.initStream(client)
    setInterval(() => this.maybeGetImg(), 500)
  }

  async initStream(client: TwitterApi) {
    this.stream = await client.v2.sampleStream({
      expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id'],
      'media.fields': ['url'],
      //   'media.fields': ['url','type'], expansions: 'attachments.media_keys' ,'tweet.fields': 'attachments'
    })
    this.setEvents()
  }

  setEvents() {
    this.stream.on(
      // Emitted when Node.js {response} emits a 'error' event (contains its payload).
      ETwitterStreamEvent.ConnectionError,
      err => console.log('Connection error!', err),
    );

    this.stream.on(
      // Emitted when Node.js {response} is closed by remote or using .close().
      ETwitterStreamEvent.ConnectionClosed,
      () => console.log('Connection has been closed.'),
    );

    this.stream.on(
      // Emitted when a Twitter payload (a tweet or not, given the endpoint).
      ETwitterStreamEvent.Data,
      (d) => this.dataCb(d)
    );

    this.stream.on(
      // Emitted when a Twitter sent a signal to maintain connection active
      ETwitterStreamEvent.DataKeepAlive,
      () => console.log('Twitter has a keep-alive packet.'),
    );

  }

  dataCb(data: any) {
    if (this.imgUrls.length > this.maxImgUrlStack) return
    if (data.includes?.media) {
      const media = data.includes?.media.filter((item: { type: string, url: string, media_key: string }) => {
        return item.type == 'photo'
      })
      if (media.length > 0) {
        const randI = Math.floor(Math.random() * media.length)
        this.addImgUrl(media[randI].url)
      }

      // console.log('Twitter has sent something:', data.includes.media)
    }
  }


  async getImg(url: string): Promise<[Jimp, string] | undefined> {
    let img: Jimp
    let hash: string
    try {
      img = await downloadJimpImg(url)
      hash = img.hash()

    } catch (err) {
      // Be eager, move on
      return undefined
    }
    if (!(this.hashes.some(h => h == hash))) {
      return [img, hash]
    }
    return undefined
  }

  async writeFile(img: [Jimp, string]) {
    await img[0].writeAsync(this.outdir + this.i + '_' + img[1] + ".png")
    console.log(this.outdir + this.i + '_' + img[1] + ".png")
    this.i += 1
  }

  async checkNSFW(img: Jimp) {
    const decoded = await this.convert(img)

    // const buf = await img.getBufferAsync(Jimp.MIME_PNG)
    // const decoded = tf.node.decodeImage(buf, 4)
    const results = await this.nsfwModel.classify(decoded)
    // const results = "hey hey"
    decoded.dispose()
    return results
  }

  async convert(img: Jimp): Promise<tf.Tensor3D> {
    // Decoded image in UInt8 Byte array
    const image = img.bitmap

    const numChannels = 3
    const numPixels = image.width * image.height
    const values = new Int32Array(numPixels * numChannels)

    for (let i = 0; i < numPixels; i++)
      for (let c = 0; c < numChannels; ++c)
        values[i * numChannels + c] = image.data[i * 4 + c]

    return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32')
  }
  addImgUrl(url){
    if(this.imgUrls.length >= this.maxImgUrlStack ){
      this.imgUrls.shift()
    }
    this.imgUrls.push(url)
  }

  extractNeutralProb(arr: { className: string, probability: number }[]): number {
    const entry = arr.find(i => i.className == "Neutral")
    return entry.probability
  }

  async maybeGetImg() {
    if (this.imgUrls.length < 1) return
    if (this.currentlyDownloading >= this.maxDownloadStack) return
    this.currentlyDownloading += 1
    const img = await this.getImg(this.imgUrls.pop())
    if (img) {
      const nres = await this.checkNSFW(img[0])
      if (this.extractNeutralProb(nres) > 0.92) {
        await this.writeFile(img)
        console.log(this.i + "downloaded")
        if (this.i > this.amount) {
          console.log('done')
          this.stream.close();
          process.exit()
        }
      }
    }
    this.currentlyDownloading -= 1
  }
}
