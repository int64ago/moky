module.exports = function(ctx) {
  console.log('Params: ', ctx.query)
  return { test: "test1" }
}