const Proxy = require('../lib/proxy')
const u = require('../lib/utils')

module.exports = (options) => {
  return async (ctx, next) => {
    const proxy = Proxy(options)
    let page = u.mapUrlToPage(ctx.path, options.urlMaps)

    if (page) {
      if (page.startsWith('/')) page = page.substr(1)
      let data = {}

      if (proxy) {
        u.log.yellow(`Proxy page: ${ctx.path}`)
        const proxyRes = await proxy(ctx.req)
        ctx.set(proxyRes._headers)
        if (proxyRes.statusCode !== 200) {
          ctx.status = proxyRes.statusCode
          ctx.body = proxyRes.body
          return
        }
        if (u.hasProxyHeader(proxyRes)) {
          data = JSON.parse(proxyRes.body || "{}")
        }
      } else {
        u.log.blue(`Render page: ${page}`)
        data = await u.getViewsMock(page, ctx, options)
      }

      options.verbose && u.log.blue(`Render data: ${JSON.stringify(data)}`)
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}
