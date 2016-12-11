import pathToRegexp from 'path-to-regexp'
import log from 'fancy-log'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

const readObjFromFile = file => {
  if (!fs.existsSync(file + '.json') && !fs.existsSync(file + '.js')) {
    log.error(chalk.red(`${file}.js{on} doesn't exists`))
    return {}
  }
  try {
    return require(file)
  } catch (err) {
    log.error(chalk.red(err))
    return {}
  }
}

export function mapUrlToPage (url, urlMaps) {
  for (let k in urlMaps) {
    if (pathToRegexp(k).test(url)) {
      return urlMaps[k]
    }
  }
  return null
}

export function parseConfig (absPath) {
  if (!fs.existsSync(absPath)) {
    log.error(chalk.red(`File not found: ${absPath}`))
    return {}
  }

  let config = require(absPath)
  // Required properties check
  for (let c of ['viewsPath', 'viewConfig', 'urlMaps']) {
    if (!config[c]) {
      log.error(chalk.red(`<${c}> is required`))
      return {}
    }
  }
  return config
}

export function getViewsMock (page, mockPath = '') {
  const commonMock = readObjFromFile(path.join(mockPath, '__COMMON__'))
  if (!mockPath) {
    log.error(chalk.red(`Page: ${page}, mockPath: ${mockPath}, not exists`))
    return Object.assign(commonMock)
  }
  const mockFile = path.join(mockPath, page)
  return Object.assign(commonMock, readObjFromFile(mockFile))
}

export function getAsyncMock (method, urlPath, mockPath) {
  if (!mockPath) {
    log.error(chalk.red(`urlPath: ${urlPath}, mockPath: ${mockPath}, not exists`))
    return {}
  }
  const mockFile = path.join(mockPath, method.toLowerCase(), urlPath)
  return readObjFromFile(mockFile)
}
