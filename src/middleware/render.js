import Proxy from '../lib/proxy'
import { extname } from 'path'
import * as u from '../lib/utils'

export default function (options) {
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
          data = JSON.parse(proxyRes.body)
        }
      } else {
        u.log.blue(`Render page: ${page}`)
        data = u.getViewsMock(page, options)
      }
      options.verbose && u.log.blue(`Render data: ${JSON.stringify(data)}`)
      // Patch for inside project
      if (options.viewConfig.extension === 'ftl' &&
        (!extname(page) || extname(page) !== '.ftl')) {
        page += '.ftl'
      }
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}
