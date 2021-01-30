import compare2Images from './compare2Images'
import Jimp from 'jimp'

export default function(imgbuff: Jimp, buffarr: Jimp[]): Promise<boolean>{
    return new Promise((resolve, _reject)=>{
        if (buffarr.length === 0) resolve(true)
        const bool_arr = buffarr.map((item)=>compare2Images(imgbuff,item))
        if(bool_arr.some(item=>item===false)){
            resolve(false)
        } else {
            resolve(true)
        }
        // Promise.all(buffarr.map((i)=>{return compare2Images(imgbuff, i)})).then((arr: boolean[])=>{
        // })
    })
}
