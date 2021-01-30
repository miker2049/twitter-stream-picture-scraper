import Jimp from 'jimp/*';

export default interface ILogObject{
    url: string
    text: string
    authorid: string
    created_at: string
    img?: Jimp
}
