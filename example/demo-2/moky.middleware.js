const path = require('path');
const webpack = require('webpack');
const { existsSync } = require('fs-extra');

module.exports = (app, options, render, async) => {
    const absPath = path.resolve('build/webpack.dev.conf.js');
    const webpackConfig = require(absPath);
    const compiler = webpack(webpackConfig);

    var devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      quiet: false
    });

    var hotMiddleware = require('koa-webpack-hot-middleware')(compiler, {
      log: () => {},
    });

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' });
        cb();
      });
    });

    // handle fallback for HTML5 history API
    app.use(require('koa-connect-history-api-fallback')({
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
    }));

    // serve webpack bundle output
    app.use(devMiddleware);

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware);

    // moky async middleware, includes proxy and mock server
    app.use(async(options));
}