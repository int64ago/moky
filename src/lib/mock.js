export default function (env) {
  return async (ctx, next) => {
    if (env !== 'mock') {
      return await next()
    }
    ctx.body = 'Mock'
  }
}
