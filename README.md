<p align="center">
  <a href="#">
    <img alt="MOKY" src="https://cloud.githubusercontent.com/assets/2230882/22627374/0f829552-ebfd-11e6-90ba-b785434d2800.png"/>
  </a>
</p>

# moky = mock + proxy

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Downloads][downloads-image]][npm-url]

A proxy server with mock

[中文 README](README-zh_CN.md)

## How to use

> Node: v7.6.0+

 - `npm i moky -g` (or `yarn global add moky`)
 - Run `moky -i` (if no config file), init a new `moky.config.js`
 - Modify `moky.config.js`
 - Run `moky` in the same directory with `moky.config.js`

## Quick start

If you want a quick try, clone the project to disk

 - `cd moky/example`
 - Run `moky`
 - Open `http://localhost:3000` & `http://localhost:3000/page` (default to mock mode)
 - Exit and **re**run `moky -e dev`, refresh two pages (async request is pass to proxy)

## Configure

The following is just a example, edit as your ways.

`cat moky.config.js`

```javascript
const path = require('path');

module.exports = {
  // Listen port for moky server, OPTIONAL
  localPort: 3000,

  // Asnyc api mock directory, OPTIONAL
  // eg: GET /test/api  -> get/test/api.js{on}
  asyncMockPath: path.join(__dirname, 'moky_mock/async_mock'),

  // Template mock directory, OPTIONAL
  // eg: /user/home  ->  user/home.js{on}
  // Tips: this's useful ONLY if your application is template-engine based
  viewsMockPath: path.join(__dirname, 'moky_mock/views_mock'),

  // Default async mock data, OPTIONAL
  // If mock file is missing or empty, then return this
  defaultMock: {},

  // Root directory for template rendering, REQUIRED
  viewsPath: path.join(__dirname, 'views'),

  // Static router, OPTIONAL but usually required
  publicPaths: {
    '/css': path.join(__dirname, 'public/css'),
    '/js': path.join(__dirname, 'public/js'),
  },

  // Template engine settings, the same as koa-views, REQUIRED
  viewConfig: {
    extension: 'html',
    map: { html: 'nunjucks' },
  },

  // Host name of proxy, works for `virtual hosts`, OPTIONAL
  hostName: 'randomuser.me',

  // Settings for proxy, OPTIONAL
  // Value can be like: <URL1>#<URL2>,
  // here <URL1> is for page proxy, <URL2> is for async api proxy
  // Tips: if <URL1> is missing, then page uses mock data
  proxyMaps: {
    dev: '#https://104.31.90.126:443',
    local: 'http://localhost:8080',
  },

  // Settings for template page routing, REQUIRED
  // Tips: path prefix and file suffix are not required
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
  - pug

**BUT**, for we use [koa-views](https://github.com/queckezz/koa-views) and koa-views use [consolidate.js](https://github.com/tj/consolidate.js), it's quite easy to enable a template engine, if you use a template engine we don't include, issues welcome :-)

## More

`moky -h`
```text
Usage: moky [options]

Options:
  -e, --env      Proxy env, see <proxyMaps> in configure file   [default: false]
  -i, --init     Create a config file in current directofy      [default: false]
  -c, --config   Configure file path                 [default: "moky.config.js"]
  -r, --rewrite  Write proxy data to mock file (1-write if not exist, 2-write
                 even if exist)                                     [default: 0]
  -V, --verbose  Show detail logs                               [default: false]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```

## Integrate in your app

It's easy to integrate `moky` in your own cli app.

 - Install as dependencies: `npm i moky -S`
 - In the entry of your app:
 ```javascript
const yargs = require('yargs')
const { builder, handler } = require('moky')

const argv = yargs
  .options(builder)
  .argv

handler(argv)
 ```
For more, see `src/cli.js`

## Tips

 - Be tired with filling common views mock ? Try putting a `__COMMON__.js{on}` in `viewsMockPath` !
 - Mock files with js(Should be exported as CommonJS module) & json extension are friendly supported.
 - Use `moky -e` for proxyMaps list, `moky -e <url>` & `moky -e <key>` both work well.
 - `--rewrite` option is ONLY for async request.

## About views(page) proxy

> If your application is SPA, you can ignore this part.

If we set views in proxy mode, actually we can't work in right way.

In mock mode, we get JSON data from local dist and render it with template files, at last, we see the rendered HTML file. But in proxy mode, the server returns HTML file by default, we can't extract JSON data from HTML file!

Then, in real world, we need to **patch** server, the most import is making the server recognize the sender of requests. In `moky`, we append a `X-Proxy-Header: true` header in every requests, you should patch your server in a proper way(which depends on the type of the engine). If you receive such header, just return the data you will render in template file, and write back the header.

If your server is NodeJS, you can patch in middleware; if it's Java with Spring MVC, you can patch in interceptor. These will not break normal logic neither.

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
