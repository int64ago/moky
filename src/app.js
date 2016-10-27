import Koa from 'koa'
import views from 'koa-views-2'
import httpProxy from 'http-proxy'
import server from 'koa-static'
import favicon from 'koa-favicon'
import mount from 'koa-mount'
import log from 'fancy-log'
import { mapUrlToPage, getViewsMock, getAsyncMock } from './utils'

export default function (options) {
  const app = new Koa()

  // Proxy settings
  let proxy = null
  if (options.proxyMaps[options.env]) {
    proxy = httpProxy.createProxyServer({
      target: options.proxyMaps[options.env],
      changeOrigin: true
    })
    log(`Seting proxy target to ${options.proxyMaps[options.env]}`)
  }

  // View settings
  app.use(views(options.viewsPath, options.viewConfig))

  // Handle proxy error
  proxy && proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    })
    res.end('Proxy Error!')
    log.error(err)
  })

  // Handle koa error
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.throw(500, err)
    }
  })

  // Server favicon
  if (options.faviconPath) {
    app.use(favicon(options.faviconPath))
    log(`Server favicon: ${options.faviconPath}`)
  }
  // Server static
  for (let [k, v] of Object.entries(options.publicPaths || {})) {
    app.use(mount(k, server(v)))
    log(`Mount path <${k}> with <${v}>`)
  }

  // Views map & render
  app.use(async (ctx, next) => {
    const page = mapUrlToPage(ctx.url, options.urlMaps)
    if (page) {
      const data = getViewsMock(page, options.viewsMockPath)
      log(`Render page: ${page}`)
      log(`Render data: ${JSON.stringify(data)}`)
      await ctx.render(page, data)
    } else {
      await next()
    }
  })

  // Others, pass to proxy or asyncMock
  // Ref: https://github.com/koajs/koa/issues/198
  app.use(async ctx => {
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
  })

  // Listen
  app.listen(options.localPort || 3000)
  log(`Listen on port: ${options.localPort || 3000}`)
}
