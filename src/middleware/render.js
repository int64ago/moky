import log from 'fancy-log-chalk'
import Proxy from '../lib/proxy'
import { mapUrlToPage, getViewsMock } from '../lib/utils'

const isJsonRes = proxyRes => {
  return !!proxyRes._headers['x-proxy-header']
}

export default function (options) {
  return async (ctx, next) => {
    const proxy = Proxy(options)
    const { viewsMockPath, autoGenMock, defaultMock } = options
    let page = mapUrlToPage(ctx.path, options.urlMaps)
    if (page) {
      if (page.startsWith('/')) page = page.substr(1)
      log.blue(`Render page: ${page}`)
      let data = getViewsMock(page, viewsMockPath, autoGenMock, defaultMock)
      if (proxy) {
        log.yellow(`Proxy page: ${ctx.path}`)
        const proxyRes = await proxy(ctx.req)
        ctx.set(proxyRes._headers)
        if (proxyRes.statusCode !== 200) {
          ctx.status = proxyRes.statusCode
          ctx.body = proxyRes.body
          return
        }
        if (isJsonRes(proxyRes)) {
          data = JSON.parse(proxyRes.body)
        }
      }
      options.verbose && log.blue(`Render data: ${JSON.stringify(data)}`)
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}
