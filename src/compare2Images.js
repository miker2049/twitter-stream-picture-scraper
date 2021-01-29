
const compare = require("resemblejs/compareImages")
const pixelmatch = require("pixelmatch")
const sizeOf = require("image-size")
const PNG = require("pngjs").PNG

/*
 * Returns a promise which resolves into a boolea:
 * if "true" the images a different
 */
export default function compare2Images(imgBuff1, imgBuff2){
    const options = {
        // stop comparing once determined to be > 5% non-matching; this will
        // also enable compare-only mode and no output image will be rendered;
        // the combination of these results in a significant speed-up in batch processing
        returnEarlyThreshold: 5,
        compareOnly: true,
    };
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    return new Promise((resolve, reject)=>{
        const buff1Size =sizeOf(imgBuff1)
        const buff2Size =sizeOf(imgBuff2)
        if(buff1Size.width != buff2Size.width || buff1Size.height != buff2Size.height){
            resolve(true)
        } else{
            let diffPixels = pixelmatch(imgBuff1,imgBuff2, null, buff1Size.width, buff1Size.height)
            if(diffPixels > (PNGimgBuff1.width*PNGimgBuff1.height)*0.05){
                resolve(true)
            } else {
                resolve(false)
            }
            // compare(imgBuff1, imgBuff2, options)
        //     .then((data) => {
        //         resolve(data.rawMisMatchPercentage > 5 ? true : false)
        //         // resolve(data)
        //         /*
        //           {
        //           misMatchPercentage : 100, // %
        //           isSameDimensions: true, // or false
        //           dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
        //           getImageDataUrl: function(){}
        //           }
        //         */
        //     })
        //     .catch( (err)=>{
        //         console.log("An error!")
        //         console.err(err);
        //         reject()
        //     })
        }
    })
}

//  (async function (){
//   let buff1 =await fsp.readFile('../__tests__/assets/one.png')
//   let buff2 =await fsp.readFile('../__tests__/assets/two.png')
//   console.log('here')
//   const output = await compare2Images( buff1, buff2)
//   // expect(true).toBe(true)
//      console.log(output)
// })()
