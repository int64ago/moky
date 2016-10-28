import httpProxy from 'http-proxy'
import log from 'fancy-log'

export default function(options) {
  // Proxy settings
  if (!options.proxyMaps[options.env]) {
    return null
  }
  const proxy = httpProxy.createProxyServer({
    target: options.proxyMaps[options.env],
    changeOrigin: true
  })
  log(`Seting proxy target to ${options.proxyMaps[options.env]}`)

  // Handle proxy error
  proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    })
    res.end('Proxy Error!')
    log.error(err)
  })
  return proxy
}