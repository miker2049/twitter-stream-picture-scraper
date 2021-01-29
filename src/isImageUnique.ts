import compare2Images from './compare2Images'

export default function(imgbuff: Buffer, buffarr: Buffer[]): Promise<boolean>{
    return new Promise((resolve, reject)=>{
        Promise.all(buffarr.map((i)=>{return compare2Images(imgbuff, i)})).then((arr: boolean[])=>{
            if(arr.some(item=>item===false)){
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}
