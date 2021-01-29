import ILogObject from './ILogObject'
import downloadImage from './downloadImage'
import processStreamData from './processStreamData'

interface IValidator {
    download(url: string, outdir: string): Promise<undefined>
    pushUnvalidated(entry: ILogObject): void
    stream: NodeJS.ReadableStream
}

export default class Validator implements IValidator {
    stream: NodeJS.ReadableStream
    tag: string
    count: number
    outDir: string
    stack: ILogObject[]
    running: boolean = false

    constructor(stream: NodeJS.ReadableStream, tag: string, count: number, outDir: string){
        this.stream = stream
        this.tag = tag
        this.count = count
        this.outDir = outDir
        this.stack = []

        this.stream.on('data',(data)=>{
            const processed = processStreamData(data, this.tag)
            if (processed != undefined) {
                this.pushUnvalidated(processed)
            }
        })
    }

    download = downloadImage

    pushUnvalidated(entry: ILogObject): void {
        this.stack.push(entry)
        if(!this.running){
            this.running = true
            this.startValidations()
        }
    }

    startValidations(){
        downloadImage(this.stack.pop().url).then((buff)=>{

        })
    }
}
