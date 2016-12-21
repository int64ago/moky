import log from 'fancy-log'
import chalk from 'chalk'
import { mapUrlToPage, getViewsMock } from '../lib/utils'

export default function (options) {
  return async (ctx, next) => {
    const { viewsMockPath = '', autoGenMock = false } = options
    let page = mapUrlToPage(ctx.path, options.urlMaps)
    if (page) {
      if (page.startsWith('/')) page = page.substr(1)
      const data = getViewsMock(page, viewsMockPath, autoGenMock)
      log(chalk.blue(`Render page: ${page}`))
      options.verbose && log(chalk.blue(`Render data: ${JSON.stringify(data)}`))
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}
