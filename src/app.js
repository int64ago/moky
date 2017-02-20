import Koa from 'koa'
import path from 'path'
import views from 'koa-views'
import server from 'koa-static'
import favicon from 'koa-favicon'
import mount from 'koa-mount'
import engine from './lib/engine'
import { error, render, async } from './middleware'
import { log, printProxyMaps } from './lib/utils'

export { parseConfig } from './lib/utils'

export function moky (options = {}) {
  if (!options.urlMaps) return
  if (options.env && printProxyMaps(options)) return

  const app = new Koa()

  // View settings
  const viewConfig = Object.assign(options.viewConfig, {
    engineSource: engine(options.viewsPath)
  })
  app.use(views(options.viewsPath, viewConfig))

  // Handle koa error
  app.use(error)

  // Server favicon
  const fav = options.faviconPath || path.join(__dirname, '../assets/favicon.ico')
  app.use(favicon(fav))
  log.cyan(`Server favicon: ${fav}`)

  // Server static
  for (let [k, v] of Object.entries(options.publicPaths || {})) {
    app.use(mount(k, server(v)))
    log.cyan(`Mount path ${k} -> ${v}`)
  }

  // Views map & render
  app.use(render(options))

  // Others, pass to proxy or asyncMock
  app.use(async(options))

  // Listen
  app.listen(options.localPort || 3000)
  log.green(`Listen on port: ${options.localPort || 3000}`)
}
