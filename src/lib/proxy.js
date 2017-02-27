const url = require('url')
const httpProxy = require('http-proxy')
const { ServerResponse } = require('http')

module.exports = (options) => {
  // `env` support two ways:
  // stable_dev as proxy url key
  // http://192.168.1.1:2333 as proxy url
  const target = options.proxyMaps[options.env] || options.env || ''
  if (!url.parse(target)['protocol']) {
    return null
  }

  const proxyOpts = {
    target,
    headers: {
      'accept-encoding': 'gzip;q=0,deflate,sdch,br',
      'x-proxy-header': 'true'
    }
  }
  if (options.hostName) {
    proxyOpts.headers['host'] = options.hostName
  }
  const proxy = httpProxy.createProxyServer(proxyOpts)

  proxy.on('end', function (req, res, proxyRes) {
    res.emit('proxyEnd')
  })

  proxy.on('error', function (err, req, res) {
    res.emit('proxyError', err)
  })

  return req => {
    const res = new ServerResponse(req)
    const bodyBuffers = []
    res.write = chunk => {
      bodyBuffers.push(chunk)
      return true
    }
    return new Promise((resolve, reject) => {
      proxy.web(req, res)
      res.on('proxyEnd', () => {
        res.body = Buffer.concat(bodyBuffers).toString('utf8')
        resolve(res)
      })
      res.on('proxyError', err => {
        reject(err)
      })
    })
  }
}
