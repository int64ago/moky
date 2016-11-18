import Koa from 'koa'
import views from 'koa-views-2'
import server from 'koa-static'
import favicon from 'koa-favicon'
import mount from 'koa-mount'
import log from 'fancy-log'
import chalk from 'chalk'
import { error, render, async } from './middleware'

export { parseConfig } from './lib/utils'

export function moky (options = {}) {
  if (!options.urlMaps) return

  const app = new Koa()

  // View settings
  app.use(views(options.viewsPath, options.viewConfig))

  // Handle koa error
  app.use(error)

  // Server favicon
  if (options.faviconPath) {
    app.use(favicon(options.faviconPath))
    log(chalk.cyan(`Server favicon: ${options.faviconPath}`))
  }
  // Server static
  for (let [k, v] of Object.entries(options.publicPaths || {})) {
    app.use(mount(k, server(v)))
    log(chalk.cyan(`Mount path ${k} -> ${v}`))
  }

  // Views map & render
  app.use(render(options))

  // Others, pass to proxy or asyncMock
  app.use(async(options))

  // Listen
  app.listen(options.localPort || 3000)
  log(chalk.green(`Listen on port: ${options.localPort || 3000}`))
}
