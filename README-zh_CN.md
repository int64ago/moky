<p align="center">
  <a href="#">
    <img alt="MOKY" src="https://cloud.githubusercontent.com/assets/2230882/22627374/0f829552-ebfd-11e6-90ba-b785434d2800.png"/>
  </a>
</p>

# moky = mock + proxy

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Downloads][downloads-image]][npm-url]

一个提升前后端协作开发效率的工具，包括了 mock 和 proxy

## 如何使用

> Node 版本至少为 v7.6.0

 - `npm i moky -g`（或者 `yarn global add moky`）
 - 如果是第一次使用，运行 `moky -i` 可以初始化一个配置文件 `moky.config.js`
 - 根据需求编辑 `moky.config.js`
 - 在 `moky.config.js` 同级目录下运行 `moky` 

## 快速体验

如果你仅仅想快速体验下，可以 clone 本项目

 - 进入 example 目录 `cd moky/example`
 - 直接运行 `moky`
 - 试着打开 `http://localhost:3000` 和 `http://localhost:3000/page` 两个页面（mock 模式，用本地模拟数据）
 - 终止再重新运行 `moky -e dev`，刷新刚刚两个页面（此时是 proxy 模式，异步接口会从 proxy 的目标机器拉数据）

## 配置

下面是 example 例子里的配置文件，每个项目都需要根据需求具体设置

`cat moky.config.js`

```javascript
const path = require('path');

module.exports = {
  // 本地服务监听端口，可选，默认 3000
  localPort: 3000,

  // 异步接口的 mock 数据路径，可选
  // 请求 GET /test/api 的 mock 文件为 get/test/api.js{on}
  asyncMockPath: path.join(__dirname, 'moky_mock/async_mock'),

  // 同步页面的 mock 数据路径，可选
  // 请求页面地址 /user/home 的 mock 文件为 user/home.js{on}
  // 提示：如果你的应用是基于 ejs/swig/jade/... 等模板引擎的，这个才有意义
  viewsMockPath: path.join(__dirname, 'moky_mock/views_mock'),

  // 异步接口的默认 mock 数据，可选
  // 如果异步接口的 mock 文件缺失或者空，则会返回这里设置的值
  defaultMock: {},

  // 模板根路径，如果你是单页应用，那么直接设置为入口文件所在目录即可，必填
  viewsPath: path.join(__dirname, 'views'),

  // 静态文件路由，可选，不过一般都会设置（没有静态文件的应用很少吧？！）
  publicPaths: {
    '/css': path.join(__dirname, 'public/css'),
    '/js': path.join(__dirname, 'public/js'),
  },

  // 模板引擎设置的参数，跟 koa-views 参数一致，必填
  viewConfig: {
    extension: 'html',
    map: { html: 'nunjucks' },
  },

  // Host 头，在 proxy 模式下，如果目标机配置了虚拟主机这个会比较有用，可选
  hostName: 'randomuser.me',

  // 代理目标设置，可选
  // 格式可以是：<URL1>#<URL2> 这种形式
  // 这里的 <URL1> 表示页面代理目标，<URL2> 是异步接口代理目标
  // 提示：如果 <URL1> 不设置，就表示页面不走代理，使用本地 mock 数据
  proxyMaps: {
    dev: '#https://104.31.90.126:443',
    local: 'http://localhost:8080',
  },

  // 页面路由设置，必填
  // 提示：模板文件的路径前缀和后缀不要写
  urlMaps: {
    '/': 'index',
    '/page': 'page/index',
  },
}
```

## 模板引擎

`moky` 内置了几个比较主流的模板引擎，如果你的应用使用的是以下模板引擎，你直接就可以使用

  - freemarker（需要 Java 环境支持，`JAVA_HOME` 设置好）
  - handlebars
  - nunjucks
  - ejs
  - pug

**但是**，因为使用了 [koa-views](https://github.com/queckezz/koa-views) ，并且 koa-views 使用了 [consolidate.js](https://github.com/tj/consolidate.js)，理论上 consolidate 支持的模板引擎都支持，如果使用中缺少，可以提 PR，会即时加上

## 更多

可以通过 `moky -h` 查看更多命令行参数

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

## 与其它应用集成

`moky` 允许与其它命令行工具应用集成

 - 安装：`npm i moky -S`
 - 在应用入口处，大致如下写：

 ```javascript
const yargs = require('yargs')
const { builder, handler } = require('moky')

const argv = yargs
  .options(builder)
  .argv

handler(argv)
 ```
具体可参考 `src/cli.js`

## 小技巧

 - 如果使用的模板引擎渲染页面，一般会包含一些公共数据，如侧边栏菜单等，这类 mock 数据可以放到 `viewsMockPath` 的 `__COMMON__.js{on}` 文件里， `moky` 会自动每次追加上
 - mock 文件除了 JSON 格式，还支持 JS（需要按 CommonJS 格式导出），所以理论上可以写任何你需要的复杂逻辑
 - 可以通过 `moky -e` 查看可用的代理列表，代理除了通过在 `proxyMaps` 设置的 `<key>` 指定 `moky -e <key>`，还可以直接跟 url `moky -e <url>` 用于临时目的
 - 考虑到应用的复杂性，`--rewrite` 命令参数只针对异步接口生效，会用 proxy 数据覆盖本地 mock 数据，不理解的话建议不要随意使用

## 同步页面的代理

> 如果你的应用是基于 MV* 框架的单页应用，这部分可以跳过

如果我们的同步页面设置为 proxy 模式，一般是不会正常工作的

在 mock 模式下，`moky` 会先从本地拿到对应的 mock JSON 数据，然后渲染到模板文件上，返回给客户端渲染好的 HTML。但是在 proxy 模式下，服务端会直接返回渲染好的 HTML 页面，通常是无法从 HTML 页面里剥离出渲染上去的数据的

因此，在真实使用中，需要合理地给服务端**打补丁**，其中最重要的一步就是让服务端知道请求是谁发出来的。在 `moky` 里，每一个请求都会加上 `X-Proxy-Header: true` 的头，如何给服务端打补丁这取决于服务端类型。如果服务端接收到 `moky` 的这个头，仅仅返回将要渲染到模板上的数据即可，并且回写上述的头，剩下的事 `moky` 会处理好（其实剩下流程跟 mock 模式一样）

如果服务端是 NodeJS，你可以把补丁写在中间件里，如果是 Spring MVC，可以写在拦截器里，其它类似，这些都不会影响正常的业务逻辑。

## 协议
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
