import compare2Images from '../src/compare2Images';
import downloadJimpImg from '../src/downloadJimpImg';
import isImageUnique from '../src/isImageUnique';
import Jimp from 'jimp';
// const fsp = fs.promises
// jest.setTimeout(50000)



describe('jimp loader',()=>{

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
  describe('comparing images', () => {
  let buff1: Jimp
  let buff1_again: Jimp
  let buff2: Jimp
  let buff3: Jimp
  let buff4: Jimp
  let buff5: Jimp
  let buff6: Jimp
  let buff7: Jimp
  let buff8: Jimp
  let buff9: Jimp
  let buff10: Jimp
  beforeAll(async()=>{
    buff1 =await downloadJimpImg('./__tests__/assets/one.png')
    buff1_again =await downloadJimpImg('./__tests__/assets/one.png')
    buff2 =await downloadJimpImg('./__tests__/assets/two.png')
    buff3 =await downloadJimpImg('./__tests__/assets/three.jpg')
    buff4 =await downloadJimpImg('./__tests__/assets/four.jpg')
    buff5 =await downloadJimpImg('./__tests__/assets/five.png')
    buff6 =await downloadJimpImg('./__tests__/assets/six.png')
    buff7 =await downloadJimpImg('./__tests__/assets/seven.jpg')
    buff8 =await downloadJimpImg('./__tests__/assets/eight.jpg')
    buff9 =await downloadJimpImg('./__tests__/assets/nine.jpg')
    buff10 =await downloadJimpImg('./__tests__/assets/ten.jpg')
  })

    it('successfully discriminates two pictures is identical or not', async ()=>{
      const different = compare2Images( buff1, buff2)
      const same = compare2Images( buff1, buff1_again)
      expect(different).toBe(true)
      expect(same).toBe(false)
    })
    it('works between png and jpg', async ()=>{
      const different = compare2Images( buff1, buff2)
      expect(different).toBe(true)
    })

    it('sucessfully says a picture is unique or not', async () => {
      const unique = await isImageUnique(buff1,[buff2,buff3,buff4,buff5,buff6,buff7,buff8,buff9,buff10])
      const notunique = await isImageUnique(buff1,[buff1_again,buff2,buff3,buff4,buff5,buff6,buff7,buff8,buff9,buff10])
      expect(unique).toBe(true)
      expect(notunique).toBe(false)
    })
  })

})
