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

    if (proxy) {
      log.yellow(`Proxy: ${ctx.path}`)
      const proxyRes = await proxy(ctx.req)
      ctx.status = proxyRes.statusCode
      ctx.set(proxyRes._headers)
      ctx.body = proxyRes.body
    } else {
      let data = {}
      if (!isFiltered) {
        data = getAsyncMock(ctx.method, ctx.path, asyncMockPath, autoGenMock, defaultMock)
      }
      !isFiltered && log.yellow(`Mock: ${ctx.path}`)
      options.verbose && log.yellow(`Data: ${JSON.stringify(data)}`)
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify(data)
    }
  }
}
