const url = require('url')
const Proxy = require('../lib/proxy')
const u = require('../lib/utils')

module.exports = (options) => {
  const proxy = Proxy(options, true)
  return async ctx => {

    let target = ''
    let isProxyLocalPort = false
    if (options.proxyRules) {
      isProxyLocalPort = true
      for (let item in options.proxyRules) {
        const reg = new RegExp(item, 'i')
        if (reg.test(ctx.path)) {
          target = options.proxyRules[item]
          break
        }
      }

      if (target) {
        const hostWriteList = [
          '127.0.0.1',
          'localhost'
        ]
        const mokyPort = options.localPort || 3000
        const targetUrl = url.parse(target)

        if (hostWriteList.indexOf(targetUrl['hostname']) < 0) {
          isProxyLocalPort = false
        }
        if (targetUrl['port'] != mokyPort) {
          isProxyLocalPort = false
        }
      } else {
        isProxyLocalPort = false
      }
    }
    
    if (proxy && !isProxyLocalPort) {
      u.log.yellow(`Proxy: ${ctx.path}`)
      const proxyRes = await proxy(ctx.req, target)
      ctx.status = proxyRes.statusCode
      ctx.set(proxyRes._headers)

      let body = proxyRes.body
      if (u.hasProxyHeader(proxyRes)) {
        body = JSON.stringify({ 'moky says': 'Seems like a page, you should set urlMaps.' })
      } else if (u.isJSON(body)) {
        u.writeMockBack(ctx, options, JSON.parse(body))
        options.verbose && u.log.yellow(`Async data: ${body}`)
      }
      ctx.body = body
    } else {
      const data = await u.getAsyncMock(ctx.method, ctx, ctx.path, options)
      u.log.yellow(`Mock: ${ctx.path}`)

      options.verbose && u.log.yellow(`Async data: ${JSON.stringify(data)}`)
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify(data)
    }
  }
}
