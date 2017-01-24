import pathToRegexp from 'path-to-regexp'
import Proxy from '../lib/proxy'
import * as u from '../lib/utils'

export default function (options) {
  const proxy = Proxy(options)
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
      !isFiltered && u.log.yellow(`Proxy: ${ctx.path}`)
      const proxyRes = await proxy(ctx.req)
      ctx.status = proxyRes.statusCode
      ctx.set(proxyRes._headers)

      let body = proxyRes.body
      if (u.hasProxyHeader(proxyRes)) {
        body = JSON.stringify({ 'moky says': 'Seems like a page, you should set urlMaps.' })
      } else if (u.isJSON(body)) {
        u.writeMockBack(ctx, options, JSON.parse(body))
      }
      ctx.body = body
    } else {
      let data = {}
      if (!isFiltered) {
        data = u.getAsyncMock(ctx.method, ctx.path, options)
      }
      !isFiltered && u.log.yellow(`Mock: ${ctx.path}`)
      !isFiltered && options.verbose && u.log.yellow(`Data: ${JSON.stringify(data)}`)
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify(data)
    }
  }
}
