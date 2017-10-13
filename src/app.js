const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const server = require('koa-static')
const favicon = require('koa-favicon')
const mount = require('koa-mount')
const engine = require('./lib/engine')
const { error, render, async } = require('./middleware')
const { log, printProxyMaps } = require('./lib/utils')

const faviconPath = path.join(__dirname, '../example/public/favicon.ico')

module.exports = (options = {}) => {
  if (options.env && printProxyMaps(options)) return

  const app = new Koa()

  // Handle koa error
  app.use(error)

  // Server favicon
  const fav = options.faviconPath || faviconPath
  app.use(favicon(fav))
  log.cyan(`Server favicon: ${fav}`)

  if (options.middlewares) {
    const middlewares = require(options.middlewares)
    middlewares(app, options, render, async)
  } else {
    if (!options.urlMaps) return
    
    // View settings
    const viewConfig = Object.assign(options.viewConfig, {
      engineSource: engine(options.viewsPath)
    })
    app.use(views(options.viewsPath, viewConfig))

    // Server static
    for (let [k, v] of Object.entries(options.publicPaths || {})) {
      app.use(mount(k, server(v)))
      log.cyan(`Mount path ${k} -> ${v}`)
    }

    // Views map & render
    app.use(render(options))

    // Others, pass to proxy or asyncMock
    app.use(async(options))
  }

  const port = options.localPort || 3000
  app.listen(port)
  log.green(`Listen on port: ${port}`)
}
