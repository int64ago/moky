import httpProxy from 'http-proxy'
import { ServerResponse } from 'http'

export default function (options) {
  if (!options.proxyMaps[options.env]) {
    return null
  }
  const proxyOpts = {
    target: options.proxyMaps[options.env],
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
