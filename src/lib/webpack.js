const webpack = require('webpack')
const { existsSync } = require('./lib/utils')

module.exports = (app, options) => {
    if (!options.webpackConfPath) { return }
    const absPath = path.resolve(options.webpackConfPath)
    if (!existsSync(absPath)) { return }

    const webpackConfig = require(absPath)
    const compiler = webpack(webpackConfig)

    var devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      quiet: true
    })

    var hotMiddleware = require('koa-webpack-hot-middleware')(compiler, {
      log: () => {}
    })

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' })
        cb()
      })
    })

    // serve webpack bundle output
    app.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware)
}