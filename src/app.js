import Koa from 'koa'
import path from 'path'
import views from 'koa-views-2'
import server from 'koa-static'
import favicon from 'koa-favicon'
import mount from 'koa-mount'
import Logger from 'chalklog'
import { error, render, async } from './middleware'
const log = new Logger('moky')

export { parseConfig } from './lib/utils'

export function moky (options = {}) {
  if (!options.urlMaps) return

  const app = new Koa()

  // View settings
  app.use(views(options.viewsPath, options.viewConfig))

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
