import log from 'fancy-log'
import Proxy from '../lib/proxy'
import { getAsyncMock } from '../lib/utils'

export default function (options) {
  const proxy = Proxy(options)
  return async ctx => {
    // Ref: https://github.com/koajs/koa/issues/198
    ctx.response = false
    if (proxy) {
      log(`Proxy: ${ctx.url}`)
      proxy.web(ctx.req, ctx.res)
    } else {
      const data = getAsyncMock(ctx.method, ctx.path, options.asyncMockPath)
      log(`Mock: ${ctx.url}`)
      log(`Data: ${JSON.stringify(data)}`)
      ctx.res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      ctx.res.end(JSON.stringify(data || {}))
    }
  }
}