import path from 'path';

export default {
  mockPath: path.join(__dirname, 'mock'),
  viewsPath: path.join(__dirname, 'views'),
  viewConfig: {
    extension: 'ftl',
    map: { ftl: 'freemarker' },
  },
  servers: [
    { alias: 'dev', target: 'http://www.kaola.com' },
    { alias: 'local', target: 'http://localhost:3000' },
  ],
  localPort: 3000,
  urlMaps: {
    '/test1': 'index',
    '/test2': 'page/index',
  },
  env: 'dev',
}