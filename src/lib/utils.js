import pathToRegexp from 'path-to-regexp'
import decache from 'decache'
import log from 'fancy-log-chalk'
import path from 'path'
import fs from 'fs'
import { createFileSync, writeJSONSync } from 'fs-extra'

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

export function getViewsMock (page, mockPath, autoGenMock = false, defaultMock = {}) {
  if (!mockPath) return {}
  const commonMock = readObjFromFile(
    path.join(mockPath, '__COMMON__'),
    autoGenMock,
    defaultMock
  )
  const mockFile = path.join(mockPath, page)
  return Object.assign(commonMock, readObjFromFile(mockFile, autoGenMock))
}

export function getAsyncMock (method, urlPath, mockPath, autoGenMock = false, defaultMock = {}) {
  if (!mockPath) {
    log.red(`urlPath: ${urlPath}, mockPath: ${mockPath}, not exists`)
    return defaultMock
  }
  const mockFile = path.join(mockPath, method.toLowerCase(), urlPath)
  return readObjFromFile(mockFile, autoGenMock, defaultMock)
}
