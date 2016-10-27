import Koa from 'koa';
import http from 'http';
import views from 'koa-views-2';
import httpProxy from 'http-proxy';
import server from 'koa-static';
import favicon from 'koa-favicon';
import mount from 'koa-mount';
import mock from './lib/mock';
import log from 'fancy-log';
import { mapUrlToPage } from './lib/utils';

export default function(options) {
  const app = new Koa();

  // Proxy settings
  let proxy = null;
  if (options.envMaps[options.env]) {
    proxy = httpProxy.createProxyServer({
      target: options.envMaps[options.env],
      changeOrigin: true,
    });
    log(`Seting proxy target to ${options.envMaps[options.env]}`);
  }

  // View settings
  app.use(views(options.viewsPath, options.viewConfig));

  // Handle proxy error
  proxy && proxy.on('error', function(err, req, res) {
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
  if (options.faviconPath) {
    app.use(favicon(options.faviconPath));
    log(`Server favicon: ${options.faviconPath}`);
  }
  // Server static
  for (let [k, v] of Object.entries(options.publicPaths || {})) {
    app.use(mount(k, server(v)));
    log(`Mount path <${k}> with <${v}>`);
  }

  // Use mock server
  app.use(mock(options.env || 'mock'));

  // Views map & render
  app.use(async (ctx, next) => {
    const page = mapUrlToPage(ctx.url, options.urlMaps);
    if (page) {
      log(`Render page: ${page}`);
      await ctx.render(page, { test: 'test' });
    } else {
      await next();
    }
  });

  // Others, pass to proxy or asyncMock
  // Ref: https://github.com/koajs/koa/issues/198
  app.use(async ctx => {
    ctx.response = false;
    log(`Proxy: ${ctx.url}`);
    proxy && proxy.web(ctx.req, ctx.res)
  });

  // Listen
  app.listen(options.localPort || 3000);
  log(`Listen on port: ${options.localPort || 3000}`);
}