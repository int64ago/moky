const consolidate = require('consolidate')
const FastFTL = require('fast-ftl').default

module.exports = root => {
  const fastFtl = new FastFTL({ root })
  return Object.assign(consolidate, {
    freemarker: (path, data) => {
      return fastFtl.parse(path, data)
    }
  })
}
