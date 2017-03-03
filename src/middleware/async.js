const Proxy = require('../lib/proxy')
const u = require('../lib/utils')

module.exports = function (options) {
  const proxy = Proxy(options, true)

  return async ctx => {
    if (proxy) {
      u.log.yellow(`Proxy: ${ctx.path}`)
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
      const data = u.getAsyncMock(ctx.method, ctx.path, options)
      u.log.yellow(`Mock: ${ctx.path}`)

      options.verbose && u.log.yellow(`Data: ${JSON.stringify(data)}`)
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify(data)
    }
  }
}
