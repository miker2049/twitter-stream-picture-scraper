import compare2Images from '../src/compare2Images';
import downloadJimpImg from '../src/downloadJimpImg';
import isImageUnique from '../src/isImageUnique';
import Jimp from 'jimp';
// const fsp = fs.promises
// jest.setTimeout(50000)



describe('jimp loader',()=>{
  let buff1: Buffer
  let buff1_again: Buffer
  let buff2: Buffer
  let buff3: Buffer
  let buff4: Buffer
  let buff5: Buffer
  let buff6: Buffer
  let buff7: Buffer
  let buff8: Buffer
  let buff9: Buffer
  let buff10: Buffer

  beforeAll(async()=>{
    // buff1 =await (await downloadJimpImg('./__tests__/assets/one.png')).getBufferAsync(Jimp.MIME_PNG)
    // buff1_again =await (await downloadJimpImg('./__tests__/assets/one.png')).getBufferAsync(Jimp.MIME_PNG)
    // buff2 =await (await downloadJimpImg('./__tests__/assets/two.png')).getBufferAsync(Jimp.MIME_PNG)
    // buff1_again =await downloadJimpImg('./__tests__/assets/one.png')
    // buff2 =await downloadJimpImg('./__tests__/assets/two.png')
    // buff3 =await downloadJimpImg('./__tests__/assets/three.jpg')
    // buff4 =await downloadJimpImg('./__tests__/assets/four.jpg')
    // buff5 =await downloadJimpImg('./__tests__/assets/five.png')
    // buff6 =await downloadJimpImg('./__tests__/assets/six.png')
    // buff7 =await downloadJimpImg('./__tests__/assets/seven.jpg')
    // buff8 =await downloadJimpImg('./__tests__/assets/eight.jpg')
    // buff9 =await downloadJimpImg('./__tests__/assets/nine.jpg')
    // buff10 =await downloadJimpImg('./__tests__/assets/ten.jpg')
  })
  it('the downloadJimpImg func', async ()=>{
    let testjimp = await downloadJimpImg('./__tests__/assets/one.png')
    let testjimp_again = await downloadJimpImg('./__tests__/assets/one.png')
    let testjimp2 = await downloadJimpImg('./__tests__/assets/two.png')

      expect(testjimp).toBeInstanceOf(Jimp)
    let diff =Jimp.distance(testjimp,testjimp2)
    let diffsame =Jimp.distance(testjimp,testjimp_again)
    expect(diff).toBeGreaterThan(0.1)
    expect(diffsame).toBeLessThan(0.1)

    // console.time('getb')
    // let testbuff = await testjimp.getBufferAsync(Jimp.MIME_PNG)
    // console.timeEnd('getb')
    // console.time('getbcb')
    // let testbuff2 = await new Promise((res,rej)=>{testjimp.getBuffer(Jimp.MIME_PNG,(data)=>{
    //   res(data)
    // })})
    // console.timeEnd('getbcb')
    // expect(testbuff).toBeInstanceOf(Buffer)
    // expect(testbuff2).toBeInstanceOf(Buffer)
  })
  // it('gets a buff', ()=> {
  //   console.log(buff1)
  //   expect(typeof buff1).toBe('obj')
  // });
  // describe('compareImages function', () => {
  //   it('successfully discriminates two pictures is identical or not', async ()=>{
  //     const different = await compare2Images( buff1, buff2)
  //     const same = await compare2Images( buff1, buff1_again)
  //     expect(different).toBe(true)
  //     expect(same).toBe(false)
  //   })
  //   it('works between png and jpg', async ()=>{
  //     const different = await compare2Images( buff1, buff2)
  //     expect(different).toBe(true)
  //   })
  // })

  // describe('isImageUnique function', () => {
  //   it('sucessfully says a picture is unique or not', async () => {
  //     // const unique = await isImageUnique(buff1,[buff2,buff3,buff4,buff5,buff6,buff7,buff8,buff9,buff10])
  //     const notunique = await isImageUnique(buff1,[buff1_again,buff2,buff3,buff4,buff5,buff6,buff7,buff8,buff9,buff10])
  //     // expect(unique).toBe(true)
  //     expect(notunique).toBe(false)
  //   })
  // })

})
