module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.throw(500, err)
  }
}
