import {createStream, deleteAllRules, createRules} from './createStream'
import { existsSync, mkdirSync } from 'fs'
import Validator from './Validator'


(async function(query: string, tag: string, outDir: string, count: number){
  if (!existsSync(outDir)){
    mkdirSync(outDir);
  }
  await deleteAllRules()
  await createRules(query, tag)
  let [stream, abort] = await createStream()
  new Validator(stream, tag, query, count, outDir, abort)

})("(love has:images) (my OR friends OR time)", "love", "out/love/", 240)
