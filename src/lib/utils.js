const pathToRegexp = require('path-to-regexp')
const decache = require('decache')
const Logger = require('chalklog')
const path = require('path')
const chalk = require('chalk')
const url = require('url')
const https = require('https')
const { copy, writeJSONSync, removeSync, existsSync, writeJson } = require('fs-extra')

exports.log = new Logger('moky');

const getNeiData = async (ctx, neiKey='') => new Promise((resolve, reject) => {
  if(!neiKey){
    resolve(false);
  }
  const nei = 'https://nei.netease.com/api/apimock/';
  const url = `${nei}${neiKey}${ctx.path}`;
  https.get(url, (res) => {
      res.on('data', (data) => {
          try{
            json = JSON.parse(data);
            if (!json.code || json.code === 403) {
              this.log.red(`${ctx.path} in NEI doesn't exists`);
              resolve(false);
            }
            resolve(json);
          }
          catch(err){
            resolve(false);
          }
      });
  }).on('error', (e) => {
      this.log.red(`read NEI error`);
      resolve(false);
  });
});

const readObj = async (file, ctx, defaultMock = {}, neiKey='') => {
  const jsonName = file + '.json'
  const jsName = file + '.js'
  if (!existsSync(jsonName) && !existsSync(jsName)) {
    this.log.red(`${file}.js{on} doesn't exists`);
    const mockData = await getNeiData(ctx, neiKey) || defaultMock;
    writeJson(file + '.json', mockData, err => {
      if (err){
        this.log.red(err);
      }
      this.log.yellow(`set mock data to ${ctx.path}.json`);
    });
    return mockData;
  }
  try {
    decache(file)
    const obj = require(file)
    return obj
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
  if (!existsSync(absPath)) {
    this.log.red(`File not found: ${absPath}`)
    return {}
  }

  const config = require(absPath)
  // Required properties check
  for (let c of ['viewsPath', 'viewConfig', 'urlMaps']) {
    if (!config.middlewares && !config[c]) {
      this.log.red(`<${c}> is required`)
      return {}
    }
  }
  return config
}

exports.getViewsMock = async (page, ctx, options) => {
  const { viewsMockPath } = options
  if (!viewsMockPath) return {}

  const commonFile = path.join(viewsMockPath, '__COMMON__')
  const commonMock = await readObj(commonFile, ctx)

  const mockFile = path.join(viewsMockPath, page)
  return Object.assign(commonMock, await readObj(mockFile, ctx))
}

exports.getAsyncMock = async (method, ctx, urlPath, options) => {
  const { asyncMockPath, defaultMock = {}, neiKey = '' } = options
  if (!asyncMockPath) {
    this.log.red(`urlPath: ${urlPath}, mockPath: ${asyncMockPath}, not exists`)
    return defaultMock
  }
  const mockFile = path.join(asyncMockPath, method.toLowerCase(), urlPath)
  return await readObj(mockFile, ctx, defaultMock, neiKey)
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
  if (rewrite === 1 && (existsSync(jsonName) || existsSync(jsName))) return
  if (existsSync(jsName)) removeSync(jsName)

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

exports.init = (name) => {
  const MOKY_CONFIG = 'moky.config.js'

  const source = path.join(__dirname, `../../example/${MOKY_CONFIG}`)
  const dest = path.join(process.cwd(), name || MOKY_CONFIG)

  if (existsSync(dest)) return this.log.red(`File exists: ${dest}`)

  copy(source, dest, err => {
    if (err) return this.log.red('Init failed: ', err)
    this.log.green(`Create ${name || MOKY_CONFIG} successfully.`)
  })
}
