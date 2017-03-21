#!/usr/bin/env node

const yargs = require('yargs')
const updateNotifier = require('update-notifier')
const pkg = require('../package')

updateNotifier({ pkg }).notify()

const { builder, handler } = require('./index')

const argv = yargs
  .options(builder)
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .describe('v', 'Show version')
  .version(() => pkg.version)
  .argv

handler(argv)
