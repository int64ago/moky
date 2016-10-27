# moky = mock + proxy

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Downloads][downloads-image]][npm-url]

A proxy server with mock

## How to use

If you have experience in [webpack](https://github.com/webpack/webpack), it'll be a piece of cake!

Here comes the quick start:

 - Install as a global command, `npm i moky -g`
 - Create a file named `moky.config.js` in your project
 - Run `moky` in the same directory with `moky.config.js`

...Yeah, it'll not work actually :-) You need edit `moky.config.js` at first.

## Configure

The following is just a example, edit as your ways.

`cat moky.config.js`

```javascript
var path = require('path');

module.exports = {
  /* Listen port for moky server, OPTIONAL */
  localPort: 3000,
  /* Asnyc api mock data, OPTIONAL */
  asyncMockPath: path.join(__dirname, '__test__', 'mock'),
  /* Template mock data, OPTIONAL */
  viewsMockPath: path.join(__dirname, '__test__', 'tplMock'),
  /* Root directory for template rendering, REQUIRED */
  viewsPath: path.join(__dirname, '__test__', 'views'),
  /* Path of favicon.ico, OPTIONAL */
  faviconPath: path.join(__dirname, '__test__', 'public', 'favicon.ico'),
  /* Static router, OPTIONAL but usually required */
  publicPaths: {
    '/css': path.join(__dirname, '__test__', 'public', 'css'),
    '/js': path.join(__dirname, '__test__', 'public', 'js'),
  },
  /* Template engine settings, the same as koa-views, REQUIRED */
  viewConfig: {
    extension: 'ftl',
    map: { ftl: 'freemarker' },
  },
  /* Settings for proxy, OPTIONAL */
  proxyMaps: {
    dev: 'http://example.com',
    local: 'http://localhost:3000',
  },
  /* Settings for template page routing, REQUIRED */
  urlMaps: {
    '/test1': 'index',
    '/test2': 'page/index',
  }
}
```

## More

`moky -h`
```text
Usage: moky [options]

Options:
  -c, --config  Configure file path                  [default: "moky.config.js"]
  -e, --env     Debug env, see <envMaps> in configure file     [default: "mock"]
  -h, --help    Show help                                              [boolean]
```

## License
[![license][license-image]][license-url]


[downloads-image]: https://img.shields.io/npm/dm/moky.svg

[npm-url]: https://npmjs.org/package/moky
[npm-image]: https://img.shields.io/npm/v/moky.svg

[travis-url]: https://travis-ci.org/int64ago/mock-proxy
[travis-image]: https://img.shields.io/travis/int64ago/mock-proxy.svg

[license-url]: https://github.com/int64ago/mock-proxy/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/int64ago/mock-proxy.svg

[style-url]: https://github.com/airbnb/javascript
[style-image]: https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg