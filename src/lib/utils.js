const pathToRegexp = require('path-to-regexp')
const decache = require('decache')
const Logger = require('chalklog')
const path = require('path')
const chalk = require('chalk')
const url = require('url')
const fs = require('fs')
const { createFileSync, writeJSONSync, removeSync } = require('fs-extra')

exports.log = new Logger('moky')

const readObjFromFile = (file, autoGenMock = false, defaultMock = {}) => {
  const jsonName = file + '.json'
  const jsName = file + '.js'
  if (!fs.existsSync(jsonName) && !fs.existsSync(jsName)) {
    this.log.red(`${file}.js{on} doesn't exists`)
    // Auto create mock file
    if (autoGenMock) {
      createFileSync(jsonName)
      writeJSONSync(jsonName, defaultMock)
      this.log.magenta(`Create file: ${jsonName}`)
    }
    return defaultMock
  }
  try {
    decache(file)
    return require(file)
  } catch (err) {
    this.log.red(err)
    return defaultMock
  }
}

exports.mapUrlToPage = (url, urlMaps) => {
  for (let k in urlMaps) {
    if (pathToRegexp(k).test(url)) {
      return urlMaps[k]
    }
  }
  return null
}

exports.parseConfig = (absPath) => {
  if (!fs.existsSync(absPath)) {
    this.log.red(`File not found: ${absPath}`)
    return {}
  }

  let config = require(absPath)
  // Required properties check
  for (let c of ['viewsPath', 'viewConfig', 'urlMaps']) {
    if (!config[c]) {
      this.log.red(`<${c}> is required`)
      return {}
    }
  }
  return config
}

exports.getViewsMock = (page, options) => {
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

exports.getAsyncMock = (method, urlPath, options) => {
  const { asyncMockPath, autoGenMock = false, defaultMock = {} } = options
  if (!asyncMockPath) {
    this.log.red(`urlPath: ${urlPath}, mockPath: ${asyncMockPath}, not exists`)
    return defaultMock
  }
  const mockFile = path.join(asyncMockPath, method.toLowerCase(), urlPath)
  return readObjFromFile(mockFile, autoGenMock, defaultMock)
}

exports.hasProxyHeader = (proxyRes) => {
  return !!proxyRes._headers['x-proxy-header']
}

exports.isJSON = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

exports.getPath = (ctx, options) => {
  const { urlMaps, viewsMockPath, asyncMockPath } = options
  // view request
  let page = this.mapUrlToPage(ctx.path, urlMaps)
  if (page) {
    if (page.startsWith('/')) page = page.substr(1)
    return path.join(viewsMockPath, page)
  }
  // async request
  return path.join(asyncMockPath, ctx.method.toLowerCase(), ctx.path)
}

exports.writeMockBack = (ctx, options, data) => {
  // mock write option
  const rewrite = options.rewrite / 1
  const path = this.getPath(ctx, options)
  const jsonName = path + '.json'
  const jsName = path + '.js'

  if (!rewrite) return
  if (rewrite === 1 && (fs.existsSync(jsonName) || fs.existsSync(jsName))) return
  if (fs.existsSync(jsName)) removeSync(jsName)

  // Write to json file
  writeJSONSync(jsonName, data)
  this.log.yellow(`Write mock: ${jsonName}`)
  options.verbose && this.this.log.yellow(`Write mock data: ${data}`)
}

exports.printProxyMaps = (options = {}) => {
  let print = false
  const proxies = Object.keys((options.proxyMaps || {}))
  if (proxies.length === 0) {
    print = 'No available proxyMaps'
  } else if ((typeof options.env === 'boolean') || // key without value
    (!url.parse(options.env)['protocol'] && !~proxies.indexOf(options.env))) {
    print = `Available proxyMaps: ${proxies.map(p => chalk.inverse(p)).join(' ')}`
  }
  if (print) console.log(print)
  return print
}
