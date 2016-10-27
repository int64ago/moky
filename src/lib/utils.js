import pathToRegexp from 'path-to-regexp'
import log from 'fancy-log'
import path from 'path'
import fs from 'fs'

export function mapUrlToPage (url, urlMaps) {
  for (let k in urlMaps) {
    if (pathToRegexp(k).test(url)) {
      return urlMaps[k]
    }
  }
  return null
}

export function parseConfig (absPath) {
  let config = require(absPath)
  if (!config) throw new Error('Oops, something wrong in config file.')
  // Required properties check
  for (let c of ['viewsPath', 'viewConfig', 'urlMaps']) {
    if (!config[c]) throw new Error(`<${c}> is required`)
  }
  return config
}

export function getTplMock (page, mockPath) {
  if (!mockPath) {
    log.error(`Page: ${page}, mockPath: ${mockPath}, not exists`)
    return {}
  }
  const mockFile = path.resolve(mockPath, page) + '.json';
  if (!fs.existsSync(mockFile)) {
    log.error(`${mockFile} doesn't exists`)
    return {}
  }
  try {
    return JSON.parse(fs.readFileSync(mockFile, 'utf8'))
  } catch (err) {
    log.error(err)
    return {}
  }
}
