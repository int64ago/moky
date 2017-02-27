#!/usr/bin/env node

const yargs = require('yargs')
const { builder, handler } = require('./index')

const argv = yargs
  .options(builder)
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .describe('v', 'Show version')
  .version(() => require('../package').version)
  .argv

handler(argv)
