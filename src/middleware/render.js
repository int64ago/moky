import log from 'fancy-log'
import { mapUrlToPage, getViewsMock } from '../lib/utils'

export default function(options) {
  return async (ctx, next) => {
    const page = mapUrlToPage(ctx.url, options.urlMaps)
    if (page) {
      const data = getViewsMock(page, options.viewsMockPath)
      log(`Render page: ${page}`)
      log(`Render data: ${JSON.stringify(data)}`)
      await ctx.render(page, data)
    } else {
      await next()
    }
  }
}