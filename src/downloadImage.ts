import axios from 'axios'
// import fs from 'fs'
// import path from 'path'
import concat from 'concat-stream'

export default async function downloadImage (url: string): Promise<any> {

  // axios image download with response type "stream"
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })

  // pipe the result stream into a file on disc

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    let concatStream = concat((imgBuff)=>{
      resolve(imgBuff)
    })
    response.data.pipe(concatStream)
    // response.data.on('end', () => {
    //   resolve()
    // })

    response.data.on('error', () => {
      reject()
    })
  })

}
