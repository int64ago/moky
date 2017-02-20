import path from 'path'
import app from './app'
import { parseConfig } from './lib/utils'

const builder = {
  env: {
    alias: 'e',
    default: false,
    describe: 'Debug env, see <proxyMaps> in configure file'
  },
  config: {
    alias: 'c',
    default: 'moky.config.js',
    describe: 'Configure file path'
  },
  new: {
    alias: 'n',
    default: false,
    describe: 'Auto create mock file if not exists'
  },
  rewrite: {
    alias: 'r',
    default: 0,
    describe: 'Write proxy data to mock file (1-write if not exist, 2-write even if exist)'
  },
  verbose: {
    alias: 'V',
    default: false,
    describe: 'Show detail log'
  }
}

const handler = async (argv) => {
  const { env, verbose, rewrite, new: autoGenMock } = argv
  const options = parseConfig(path.resolve(argv.c))
  Object.assign(options, { env, verbose, rewrite, autoGenMock })

  app(options)
}

export { builder, handler }
