import log from 'fancy-log'
import chalk from 'chalk'
import { mapUrlToPage, getViewsMock } from '../lib/utils'

export default function (options) {
  return async (ctx, next) => {
    const page = mapUrlToPage(ctx.url, options.urlMaps)
    if (page) {
      const data = getViewsMock(page, options.viewsMockPath)
      log(chalk.blue(`Render page: ${page}`))
      log(chalk.blue(`Render data: ${JSON.stringify(data)}`))
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}
