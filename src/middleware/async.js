import pathToRegexp from 'path-to-regexp'
import log from 'fancy-log-chalk'
import Proxy from '../lib/proxy'
import { getAsyncMock } from '../lib/utils'

export default function (options) {
  const proxy = Proxy(options)
  const { asyncMockPath, autoGenMock, defaultMock } = options
  return async ctx => {
    // Issue: https://github.com/int64ago/moky/issues/3
    let isFiltered = false
    const { filteredUrls = [] } = options
    for (let k of filteredUrls) {
      if (pathToRegexp(k).test(ctx.path)) {
        isFiltered = true
      }
    }
    // Ref: https://github.com/koajs/koa/issues/198
    ctx.response = false
    if (proxy) {
      log.yellow(`Proxy: ${ctx.path}`)
      proxy.web(ctx.req, ctx.res)
    } else {
      let data = {}
      if (!isFiltered) {
        data = getAsyncMock(ctx.method, ctx.path, asyncMockPath, autoGenMock, defaultMock)
      }
      !isFiltered && log.yellow(`Mock: ${ctx.path}`)
      options.verbose && log.yellow(`Data: ${JSON.stringify(data)}`)
      ctx.res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      ctx.res.end(JSON.stringify(data))
    }
  }
}
