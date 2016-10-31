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
  .default('e', 'mock')
  .help('h')
  .alias('h', 'help')
  .argv

const options = parseConfig(path.resolve(argv.config))
options.env = argv.env

moky(options)
