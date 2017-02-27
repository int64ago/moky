const consolidate = require('consolidate')
const Freemarker = require('freemarker')

module.exports = root => {
  const fm = new Freemarker({ root })
  return Object.assign(consolidate, {
    freemarker: (path, data) => {
      return new Promise((resolve, reject) => {
        fm.renderFile(path, data, (err, html) => {
          if (err) return reject(err)
          resolve(html)
        })
      })
    }
  })
}
