import ILogObject from './ILogObject'
import processStreamData from './processStreamData'
import downloadJimpImg from './downloadJimpImg'
import isImageUnique from './isImageUnique'
import getFormattedDate from './getFormattedDate'
// const path = require('path')
import * as fs from 'fs'
// import * as readline from 'readline'

interface IValidator {
  pushUnvalidated(entry: ILogObject): void
  stream: NodeJS.ReadableStream
}

interface ILog {
  began: string
  query: string
  ended?: string
  data?: ILogObject[]
}

export default class Validator implements IValidator {
  stream: NodeJS.ReadableStream
  tag: string
  count: number
  outDir: string
  logDir: string
  stack: ILogObject[]
  verified: ILogObject[]
  log: ILog
  running: boolean = false
  aborter: AbortController
  dataBuff: any
  i: number

  constructor(stream: NodeJS.ReadableStream, tag: string, query: string, count: number, outDir: string, logDir: string, abort: AbortController) {
    this.i = 0
    this.stream = stream
    this.aborter = abort
    this.tag = tag
    this.count = count
    this.outDir = outDir
    this.logDir = logDir
    this.stack = []
    this.verified = []
    this.log = { began: getFormattedDate(), query: query }
    this.dataBuff = ''
    let buffCounter: number = 0
    this.stream.on('data', (data) => {
      // console.log(data)
      buffCounter++
      this.dataBuff += data;
      const processTry = processStreamData(data, this.tag)
      const split = this.dataBuff.split(/\r\n/)
      if (processTry != undefined) {
        this.pushUnvalidated(processTry)
        this.dataBuff = ''
      } else if (split.length > 1) {
        const processed = processStreamData(split[0], this.tag)
        if (processed != undefined) {
          this.pushUnvalidated(processed)
          this.dataBuff = split[1]
        }
      } else if (buffCounter % 5 === 0) {
        this.dataBuff = ''
      }
    })
  }


  pushUnvalidated(entry: ILogObject): void {
    this.stack.push(entry)
    if (!this.running) {
      this.running = true
      this.runValidation()
    }
  }

  async runValidation() {
    if (this.running) {
      try {
        const logitem = this.stack.shift()
        const img = await downloadJimpImg(logitem.url)
        const imgarr = this.verified.length > 90 ? this.verified.slice(this.verified.length - 90) : this.verified
        if (await isImageUnique(img, imgarr.map((item) => item.img))) {
          this.verified.push({ img, ...logitem })
          await img.writeAsync(this.outDir + this.i + "_" + "image" + ".png")
          this.i += 1
          console.log(this.verified.length)
        }


        //finished all of it
        if (this.verified.length >= this.count) {
          console.log("done!")
          this.finalize()
          this.running = false
          //not finished still have some on stack
        } else if (this.stack.length > 0) {
          this.runValidation()
        } else {
          //not finsihed none on stack
          this.running = false
        }
      } catch (err) {
        console.log(err)
        if (this.stack.length > 0) {
          this.runValidation()
        } else {
          //not finsihed none on stack
          this.running = false
        }
        // Do something
      }
    }

  }

  async finalize() {
    this.aborter.abort()
    this.log.ended = getFormattedDate()
    this.log.data = this.verified.map((i) => { return { url: i.url, created_at: i.created_at, authorid: i.authorid, text: i.text } })
    // await Promise.all(this.verified.map((i, index)=>i.img.writeAsync(this.outDir+index+"_"+"image"+".png")))
    console.log(this.logDir)
    await fs.promises.writeFile(this.logDir + this.tag + ".json", JSON.stringify(this.log))
  }
}


// function overWriteConsole(str: String) {
//     readline.clearLine(process.stdout, 0);
//     readline.cursorTo(process.stdout, 0, null);
//     let text = `${str}`;
//     process.stdout.write(text);
// }
