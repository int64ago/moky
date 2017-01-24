import pathToRegexp from 'path-to-regexp'
import decache from 'decache'
import Logger from 'chalklog'
import path from 'path'
import fs from 'fs'
import { createFileSync, writeJSONSync } from 'fs-extra'

export const log = new Logger('moky')

const readObjFromFile = (file, autoGenMock = false, defaultMock = {}) => {
  const jsonName = file + '.json'
  const jsName = file + '.js'
  if (!fs.existsSync(jsonName) && !fs.existsSync(jsName)) {
    log.red(`${file}.js{on} doesn't exists`)
    // Auto create mock file
    if (autoGenMock) {
      createFileSync(jsonName)
      writeJSONSync(jsonName, defaultMock)
      log.magenta(`Create file: ${jsonName}`)
    }
    return defaultMock
  }
  try {
    decache(file)
    return require(file)
  } catch (err) {
    log.red(err)
    return defaultMock
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
    log.red(`File not found: ${absPath}`)
    return {}
  }

  let config = require(absPath)
  // Required properties check
  for (let c of ['viewsPath', 'viewConfig', 'urlMaps']) {
    if (!config[c]) {
      log.red(`<${c}> is required`)
      return {}
    }
  }
  return config
}

export function getViewsMock (page, options) {
  const { viewsMockPath, autoGenMock = false, defaultMock = {} } = options
  if (!viewsMockPath) return {}
  const commonMock = readObjFromFile(
    path.join(viewsMockPath, '__COMMON__'),
    autoGenMock,
    defaultMock
  )
  const mockFile = path.join(viewsMockPath, page)
  return Object.assign(commonMock, readObjFromFile(mockFile, autoGenMock))
}

export function getAsyncMock (method, urlPath, options) {
  const { asyncMockPath, autoGenMock = false, defaultMock = {} } = options
  if (!asyncMockPath) {
    log.red(`urlPath: ${urlPath}, mockPath: ${asyncMockPath}, not exists`)
    return defaultMock
  }
  const mockFile = path.join(asyncMockPath, method.toLowerCase(), urlPath)
  return readObjFromFile(mockFile, autoGenMock, defaultMock)
}

export function hasProxyHeader (proxyRes) {
  return !!proxyRes._headers['x-proxy-header']
}

export function isJSON (str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
