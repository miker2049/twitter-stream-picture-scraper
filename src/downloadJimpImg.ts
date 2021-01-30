// import Jimp from 'jimp';
import Jimp = require('jimp');

export default async function(url: string): Promise<Jimp> {
    const jbuff = await Jimp.read(url)
    return jbuff
}
