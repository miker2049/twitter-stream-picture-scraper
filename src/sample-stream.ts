
import * as dotenv from 'dotenv'
import { TwitterApi, ETwitterStreamEvent, TweetStream } from 'twitter-api-v2'
import downloadJimpImg from './downloadJimpImg'
import Jimp = require('jimp');
dotenv.config()
// Obtain the persistent tokens
// Create a client from temporary tokens

export class PictureSampler {
  amount: number
  stream: TweetStream
  outdir: string
  i: number
  hashes: string[]
  imgUrls: string[]
  downloading: boolean
  parallelDownloads: number = 15

  constructor(client: TwitterApi, amount: number, outdir: string) {
    this.amount = amount
    this.outdir = outdir
    this.hashes = []
    this.imgUrls = []
    this.downloading = false
    this.i = 0
    this.initStream(client)
    setInterval(() => this.downloadUrls(), 500)
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
      async (d) => this.dataCb(d)
    );

    this.stream.on(
      // Emitted when a Twitter sent a signal to maintain connection active
      ETwitterStreamEvent.DataKeepAlive,
      () => console.log('Twitter has a keep-alive packet.'),
    );

  }

  async dataCb(data: any) {

    if (data.includes?.media) {
      const media = data.includes?.media.filter((item: { type: string, url: string, media_key: string }) => {
        return item.type == 'photo'
      })
      if (media.length > 0) {
        const randI = Math.floor(Math.random() * media.length)
        this.imgUrls.push(media[randI].url)
      }

      // console.log('Twitter has sent something:', data.includes.media)
    }
  }
  async downloadUrls() {
    if (this.imgUrls.length > 0 && this.downloading == false) {
      this.downloading = true
    } else { return }

    let urls: string[] = []
    for (let i = 0; i < Math.min(this.parallelDownloads, this.imgUrls.length); i++) {
      urls.push(this.imgUrls.shift())
    }
    console.log(urls)
    const imgs = await Promise.all(urls.map(u => this.getImg(u)))

    for (let i = 0; i < imgs.length; i++) {
      const img: [Jimp, string] = imgs[i]
      if (img) {
        await img[0].writeAsync(this.outdir + this.i + '_' + img[1] + ".png")
        console.log(this.outdir + this.i + '_' + img[1] + ".png")
        this.i += 1
      }
    }
    if (this.i > this.amount) {
      console.log('done')
      this.stream.close();
      process.exit()
    } else {
      this.downloading = false
    }
  }
  async getImg(url: string): Promise<[Jimp, string] | undefined> {
    console.log(url)
    const img = await downloadJimpImg(url)
    const hash = img.hash()
    if (!(this.hashes.some(h => h == hash))) {
      return [img, hash]
    }
    return undefined
  }
}