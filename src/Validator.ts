import ILogObject from './ILogObject'
import processStreamData from './processStreamData'
import downloadJimpImg from './downloadJimpImg'
import isImageUnique from './isImageUnique'
import getFormattedDate from './getFormattedDate'
// const path = require('path')
import * as fs from 'fs'

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
    stack: ILogObject[]
    verified: ILogObject[]
    log: ILog
    running: boolean = false
    aborter: AbortController

    constructor(stream: NodeJS.ReadableStream, tag: string, query: string, count: number, outDir: string, abort: AbortController){

        this.stream = stream
        this.aborter = abort
        this.tag = tag
        this.count = count
        this.outDir = outDir
        this.stack = []
        this.verified = []
        this.log = { began: getFormattedDate(), query: query }

        this.stream.on('data',(data)=>{
            const processed = processStreamData(data, this.tag)
            if (processed != undefined) {
                this.pushUnvalidated(processed)
            }
        })
    }


    pushUnvalidated(entry: ILogObject): void {
        this.stack.push(entry)
        if(!this.running){
            this.running = true
            this.runValidation()
        }
    }

    async runValidation(){
        if (this.running) {
            const logitem = this.stack.shift()
            const img = await downloadJimpImg(logitem.url)
            const imgarr = this.verified.length > 30 ? this.verified.slice(this.verified.length-30) : this.verified
            if(await isImageUnique(img,imgarr.map((item)=>item.img))){
                this.verified.push({img, ...logitem})
                console.log(this.verified.length)
            }


            //finished all of it
            if (this.verified.length === this.count){
                this.finalize()
                this.running = false
                //not finished still have some on stack
            } else if (this.stack.length > 0) {
                this.runValidation()
            } else {
                //not finsihed none on stack
                this.running = false
            }
        }

    }

    async finalize(){
        this.aborter.abort()
        this.log.ended = getFormattedDate()
        this.log.data = this.verified.map((i)=>{return {url: i.url, created_at: i.created_at, authorid: i.authorid, text: i.text }})
        await Promise.all(this.verified.map((i, index)=>i.img.writeAsync(this.outDir+index+"_"+"image"+".png")))
        await fs.promises.writeFile(this.outDir+this.tag+".json", JSON.stringify(this.log))
    }
}
