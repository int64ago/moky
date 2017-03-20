const consolidate = require('consolidate')
const { Render } = require('fast-ftl')

module.exports = root => {
  const ftl = Render({ root })
  return Object.assign(consolidate, {
    freemarker: (path, data) => {
      return ftl.parse(path, data)
    }
  })
}
