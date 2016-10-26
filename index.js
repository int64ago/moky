import Koa from 'koa';
import http from 'http';
import views from 'koa-views-2';
import httpProxy from 'http-proxy';
import options from './options';
import mock from './lib/mock';
import { mapUrl } from './lib/utils';

const app = new Koa();

const proxy = httpProxy.createProxyServer({
  target: 'http://example.com',
  changeOrigin: true,
});

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

// Use mock server
app.use(mock(options.env || 'mock'));

app.use(async ctx => {
  const page = mapUrl(ctx.url);
  await ctx.render(page, { test: 'test' });
});

http.createServer((req, res) => {
  const page = mapUrl(req.url);
  if (options.env !== 'mock' && false) {
    return proxy.web(req, res);
  }
  app.callback()(req, res);
}).listen(options.localPort || 3000);