import log from 'fancy-log-chalk'
import Proxy from '../lib/proxy'
import { mapUrlToPage, getViewsMock, hasProxyHeader } from '../lib/utils'

export default function (options) {
  return async (ctx, next) => {
    const proxy = Proxy(options)
    const { viewsMockPath, autoGenMock, defaultMock } = options
    let page = mapUrlToPage(ctx.path, options.urlMaps)
    if (page) {
      if (page.startsWith('/')) page = page.substr(1)
      let data = {}
      if (proxy) {
        log.yellow(`Proxy page: ${ctx.path}`)
        const proxyRes = await proxy(ctx.req)
        ctx.set(proxyRes._headers)
        if (proxyRes.statusCode !== 200) {
          ctx.status = proxyRes.statusCode
          ctx.body = proxyRes.body
          return
        }
        if (hasProxyHeader(proxyRes)) {
          data = JSON.parse(proxyRes.body)
        }
      } else {
        log.blue(`Render page: ${page}`)
        data = getViewsMock(page, viewsMockPath, autoGenMock, defaultMock)
      }
      options.verbose && log.blue(`Render data: ${JSON.stringify(data)}`)
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}
