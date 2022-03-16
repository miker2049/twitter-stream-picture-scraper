import {createStream, deleteAllRules, createRules} from './createStream'
import { existsSync, mkdirSync } from 'fs'
import Validator from './Validator'
import { program, InvalidOptionArgumentError } from 'commander'
program.version('0.0.1');

program
  .requiredOption('-q, --query <query>', 'the twitter query for filtering')
  .requiredOption('-t, --tag <tag>', 'the tag for the query')
  .requiredOption('-o, --outDir <path>', 'the out directory for pictures')
  .requiredOption('-l, --logDir <path>', 'the out directory for log')
  .requiredOption('-c, --count <count>', 'the amount of pictures to get', myParseInt)

program.parseAsync().then((prgrm)=>{

  (async function(query: string, tag: string, outDir: string, logDir: string, count: number){
    if (!existsSync(outDir)){
      mkdirSync(outDir);
    }
    await deleteAllRules()
    await createRules(query, tag)
    const [stream, abort] = await createStream()
    new Validator(stream, tag, query, count, outDir, logDir, abort)

  })(prgrm.opts().query, prgrm.opts().tag, prgrm.opts().outDir, prgrm.opts().logDir, prgrm.opts().count)
})

function myParseInt(value: any): number {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidOptionArgumentError('Not a number.');
  }
  return parsedValue;
}
