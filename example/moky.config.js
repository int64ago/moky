var path = require('path');

module.exports = {
  /* Listen port for moky server, OPTIONAL */
  localPort: 3000,
  /* Show detail log, OPTIONAL(default false) */
  verbose: false,
  /* Auto create mock file if not exists, OPTIONAL */
  autoGenMock: false,
  /* Asnyc api mock data, OPTIONAL */
  asyncMockPath: path.join(__dirname, 'moky_mock', 'async_mock'),
  /* Template mock data, OPTIONAL */
  viewsMockPath: path.join(__dirname, 'moky_mock', 'views_mock'),
  /* Default mock data, OPTIONAL */
  defaultMock: {},
  /* Root directory for template rendering, REQUIRED */
  viewsPath: path.join(__dirname, 'views'),
  /* Path of favicon.ico, OPTIONAL */
  faviconPath: path.join(__dirname, 'public', 'favicon.ico'),
  /* Static router, OPTIONAL but usually required */
  publicPaths: {
    '/css': path.join(__dirname, 'public', 'css'),
    '/js': path.join(__dirname, 'public', 'js'),
  },
  /* Template engine settings, the same as koa-views, REQUIRED */
  viewConfig: {
    extension: 'html',
    map: { html: 'nunjucks' },
  },
  /* Host name of proxy, works for `virtual hosts`, OPTIONAL */
  hostName: 'hacker-news.firebaseio.com',
  /* Settings for proxy, OPTIONAL */
  proxyMaps: {
    dev: 'https://hacker-news.firebaseio.com',
    local: 'http://localhost:8080',
  },
  /* Not show logs if url is in the list, OPTIONAL */
  filteredUrls: [],
  /* Settings for template page routing, REQUIRED */
  urlMaps: require('./moky.urlMaps'),
}