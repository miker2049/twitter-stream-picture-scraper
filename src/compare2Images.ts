// import Jimp from 'jimp';

import Jimp = require('jimp');
/*
 * returns true if they are different, takes two jimps
 */
export default function(img1: Jimp, img2: Jimp): boolean{
    if(img1.getWidth() != img2.getWidth() || img1.getHeight() != img2.getHeight()){
        return true
    } else {
        return Jimp.diff(img1,img2).percent > 0.1 ? true : false
    }
}
