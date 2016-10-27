import pathToRegexp from 'path-to-regexp'

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
