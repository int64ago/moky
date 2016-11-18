<p align="center">
  <a href="#">
    <img alt="MOKY" src="https://dn-getlink.qbox.me/0oxtp9ie44vq7m7b7kqpvi.png"/>
  </a>
</p>

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

## Quick start

If you really want to have a try, clone the project to disk

 - `cd moky/example`
 - Run `moky`
 - Open `http://localhost:3000` & `http://localhost:3000/page` (default to mock mode)
 - Exit and **re**run `moky -e dev`, refresh two pages (async request is pass to proxy)

## Configure

The following is just a example, edit as your ways.

`cat moky.config.js`

```javascript
var path = require('path');

module.exports = {
  /* Listen port for moky server, OPTIONAL */
  localPort: 3000,
  /* Show detail log, OPTIONAL(default false) */
  verbose: false,
  /* Asnyc api mock data, OPTIONAL */
  asyncMockPath: path.join(__dirname, 'mock'),
  /* Template mock data, OPTIONAL */
  viewsMockPath: path.join(__dirname, 'tplMock'),
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
  /* Settings for template page routing, REQUIRED */
  urlMaps: {
    '/': 'index',
    '/page': 'page/index',
  },
}
```

## Template engine

The `moky` has integrated some major template engines, if your template is one of the following type, your don't need to do anything, it works well.

  - freemarker (`JAVA_HOME` should set correctly)
  - handlebars
  - nunjucks
  - ejs

**BUT**, for we use [koa-views](https://github.com/queckezz/koa-views) and koa-views use [consolidate.js](https://github.com/tj/consolidate.js), it's quite easy to enable a template engine, if you use a template engine we don't include, issues welcome :-)

## More

`moky -h`
```text
Usage: moky [options]

Options:
  -c, --config  Configure file path                  [default: "moky.config.js"]
  -e, --env     Debug env, see <proxyMaps> in configure file     [default: "mock"]
  -h, --help    Show help                                              [boolean]
```

## Integrate in your app

It's easy to integrate moky in your own cli app.

 - Install as dependencies: `npm i moky -S`
 - In the entry of your app:
 ```javascript
 import path from 'path'
 import { moky, parseConfig } from 'moky'

 // get path of moky.config.js and env
 // you can use commander.js or yargs

 const options = parseConfig(path.resolve(config))
 options.env = env

 moky(options)
 ```

## Tips

 - Be tired with filling common views mock ? Try putting a `__COMMON__.json` in `viewsMockPath` !

## License
[![license][license-image]][license-url]


[downloads-image]: https://img.shields.io/npm/dm/moky.svg

[npm-url]: https://npmjs.org/package/moky
[npm-image]: https://img.shields.io/npm/v/moky.svg

[travis-url]: https://travis-ci.org/int64ago/moky
[travis-image]: https://img.shields.io/travis/int64ago/moky.svg

[license-url]: https://github.com/int64ago/moky/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/int64ago/moky.svg

[style-url]: https://github.com/airbnb/javascript
[style-image]: https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg