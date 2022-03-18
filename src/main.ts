import { createStream, deleteAllRules, createRules } from './createStream'
import { existsSync, mkdirSync } from 'fs'
import Validator from './Validator'
import { program, InvalidOptionArgumentError } from 'commander'
import { PictureSampler } from './sample-stream'

  ;import { TwitterApi } from 'twitter-api-v2';
 (async () => {
    program.version('0.0.1');

    program
      .option('-q, --query <query>', 'the twitter query for filtering')
      .option('-t, --tag <tag>', 'the tag for the query')
      .option('-o, --outDir <path>', 'the out directory for pictures')
      .option('-l, --logDir <path>', 'the out directory for log')
      .option('-s, --sample <boolean>', 'the out directory for log')
      .option('-c, --count <count>', 'the amount of pictures to get', myParseInt)

    program.parseAsync().then(async (prgrm) => {
      const opts = prgrm.opts()
      if (opts.sample) {
        if (!(opts.outDir && opts.count)) {
          throw Error("Error in input")
        }

        const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)
        new PictureSampler(client,opts.count, opts.outDir)
      } else {
        if (opts.query && opts.tag && opts.outDir && opts.logDir && opts.count) {
          throw Error("Error in input")
        }
        (async function(query: string, tag: string, outDir: string, logDir: string, count: number) {
          if (!existsSync(outDir)) {
            mkdirSync(outDir);
          }
          await deleteAllRules()
          await createRules(query, tag)
          const [stream, abort] = await createStream()
          new Validator(stream, tag, query, count, outDir, logDir, abort)

        })(opts.query, opts.tag, opts.outDir, opts.logDir, opts.count)
      }
    })

  })();

function myParseInt(value: any): number {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidOptionArgumentError('Not a number.');
  }
  return parsedValue;
}
