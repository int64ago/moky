const url = require('url')
const httpProxy = require('http-proxy')
const { ServerResponse } = require('http')

module.exports = (options, isAsync = false) => {
  // `env` support two ways:
  // stable_dev as proxy url key
  // http://192.168.1.1:2333 as proxy url
  //
  // url like http://192.168.1.1:123#http://192.168.1.1:456 is supported
  // for sync & async target urls are not the same, first is sync, second is async
  const targets = (options.proxyMaps[options.env] || options.env || '').split('#')
  let target = targets[0]
  if (isAsync && targets[1]) {
    target = targets[1]
  }
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

  proxy.on('end', (req, res, proxyRes) => {
    res.emit('proxyEnd')
  })

  proxy.on('error', (err, req, res) => {
    res.emit('proxyError', err)
  })

  return (req, target) => {
    const res = new ServerResponse(req)
    const bodyBuffers = []
    res.write = chunk => {
      bodyBuffers.push(chunk)
      return true
    }
    return new Promise((resolve, reject) => {
      if (target) {
        const newOpts = Object.assign({}, proxyOpts, { target })
        proxy.web(req, res, newOpts)
      } else {
        proxy.web(req, res, proxyOpts)
      }
      
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
