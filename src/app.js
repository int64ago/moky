import Koa from 'koa'
import views from 'koa-views-2'
import server from 'koa-static'
import favicon from 'koa-favicon'
import mount from 'koa-mount'
import log from 'fancy-log'
import { error, render, async } from './middleware'

export { parseConfig } from './lib/utils'

export function moky (options) {
  const app = new Koa()

  // View settings
  app.use(views(options.viewsPath, options.viewConfig))

  // Handle koa error
  app.use(error)

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
  app.use(render(options))

  // Others, pass to proxy or asyncMock
  app.use(async(options))

  // Listen
  app.listen(options.localPort || 3000)
  log(`Listen on port: ${options.localPort || 3000}`)
}
