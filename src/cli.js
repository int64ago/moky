#! /usr/bin/env node

import yargs from 'yargs';
import path from 'path';
import { parseConfig } from './lib/utils';
import fs from 'fs';
import app from './index';

const argv = yargs
  .usage('Usage: moky [options]')
  .alias('c', 'config')
  .describe('c', 'Configure file path')
  .default('c', 'moky.config.js')
  .alias('e', 'env')
  .describe('e', 'Debug env, see <envMaps> in configure file')
  .default('e', 'mock')
  .help('h')
  .alias('h', 'help')
  .argv

const options = parseConfig(path.resolve(argv.config));
options.env = argv.env;

app(options);