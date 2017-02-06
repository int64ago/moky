#! /usr/bin/env node

import yargs from 'yargs'
import path from 'path'
import { moky, parseConfig } from './app'

const argv = yargs
  .usage('Usage: moky [options]')
  .alias('c', 'config')
  .describe('c', 'Configure file path')
  .default('c', 'moky.config.js')
  .alias('e', 'env')
  .describe('e', 'Debug env, see <proxyMaps> in configure file')
  .alias('r', 'rewrite')
  .describe('r', 'Write proxy data to mock file (1-write if not exist, 2-write even if exist)')
  .default('r', '0')
  .help('h')
  .alias('h', 'help')
  .alias('V', 'verbose')
  .describe('V', 'Show detail log')
  .alias('n', 'new')
  .describe('n', 'Auto create mock file if not exists')
  .alias('v', 'version')
  .describe('v', 'Show version')
  .version(() => require('../package').version)
  .argv

const { env, verbose, rewrite, new: autoGenMock } = argv
const options = parseConfig(path.resolve(argv.c))
Object.assign(options, { env, verbose, rewrite, autoGenMock })

moky(options)
