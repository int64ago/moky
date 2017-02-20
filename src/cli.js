import yargs from 'yargs'
import { builder, handler } from './index'

const argv = yargs
  .options(builder)
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .describe('v', 'Show version')
  .version(() => require('../package').version)
  .argv

handler(argv)
