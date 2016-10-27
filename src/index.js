import Koa from 'koa';
import http from 'http';
import views from 'koa-views-2';
import httpProxy from 'http-proxy';
import server from 'koa-static';
import favicon from 'koa-favicon';
import mount from 'koa-mount';
import options from '../moky.config';
import mock from './lib/mock';
import { mapUrlToPage } from './lib/utils';

const app = new Koa();

// Proxy settings
const proxy = httpProxy.createProxyServer({
  target: options.proxyMaps[options.env],
  changeOrigin: true,
});

// View settings
app.use(views(options.viewsPath, options.viewConfig));

// Handle proxy error
proxy.on('error', function(err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy Error!');
});

// Handle koa error
app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    ctx.throw(500, err);
  }
});

// Server favicon
app.use(favicon(options.faviconPath));
// Server static
for (let [k, v] of Object.entries(options.publicPaths || {})) {
  app.use(mount(k, server(v)));
}

// Use mock server
app.use(mock(options.env || 'mock'));

// Views map & render
app.use(async ctx => {
  const page = mapUrlToPage(ctx.url, options.urlMaps);
  await ctx.render(page, { test: 'test' });
});

http.createServer((req, res) => {
  const page = mapUrlToPage(req.url, options.urlMaps);
  if (options.env !== 'mock' && false) {
    return proxy.web(req, res);
  }
  app.callback()(req, res);
}).listen(options.localPort || 3000);