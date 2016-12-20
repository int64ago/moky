import pathToRegexp from 'path-to-regexp'
import log from 'fancy-log'
import chalk from 'chalk'
import Proxy from '../lib/proxy'
import { getAsyncMock } from '../lib/utils'

export default function (options) {
  const proxy = Proxy(options)
  return async ctx => {
    // Issue: https://github.com/int64ago/moky/issues/3
    const logF = (msg) => {
      const { filteredUrls = [] } = options
      for (let k of filteredUrls) {
        if (pathToRegexp(k).test(ctx.path)) {
          return () => {}
        }
      }
      log(msg)
    }
    // Ref: https://github.com/koajs/koa/issues/198
    ctx.response = false
    if (proxy) {
      logF(chalk.yellow(`Proxy: ${ctx.path}`))
      proxy.web(ctx.req, ctx.res)
    } else {
      const data = getAsyncMock(ctx.method, ctx.path, options.asyncMockPath)
      logF(chalk.yellow(`Mock: ${ctx.path}`))
      options.verbose && logF(chalk.yellow(`Data: ${JSON.stringify(data)}`))
      ctx.res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      ctx.res.end(JSON.stringify(data || {}))
    }
  }
}
