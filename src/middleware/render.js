import log from 'fancy-log-chalk'
import { mapUrlToPage, getViewsMock } from '../lib/utils'

export default function (options) {
  return async (ctx, next) => {
    const { viewsMockPath, autoGenMock, defaultMock } = options
    let page = mapUrlToPage(ctx.path, options.urlMaps)
    if (page) {
      if (page.startsWith('/')) page = page.substr(1)
      const data = getViewsMock(page, viewsMockPath, autoGenMock, defaultMock)
      log.blue(`Render page: ${page}`)
      options.verbose && log.blue(`Render data: ${JSON.stringify(data)}`)
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}
