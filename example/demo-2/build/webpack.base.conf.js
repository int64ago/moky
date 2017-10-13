/* 打包之前，生成最新的路由文件 */
require('./router.js');

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = process.env.NODE_ENV;
const PROD = env === 'production' ? true : false;
const OUTPUT_PATH = path.resolve(__dirname, '../dist');

const resolve = (dir) => {
  return path.join(__dirname, '..', dir);
};

module.exports = {
  entry: {
    main: resolve('src/javascript/main.js')
  },
  output: {
    path: OUTPUT_PATH,
    filename: PROD ? 'javascript/[name].[hash].js' : 'javascript/[name].js', 
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.less', '.json'],
    alias: {
      '@': resolve('src/javascript'),
      'common': resolve('src/javascript/common'),
      'widget': resolve('src/javascript/widget'),
      'page': resolve('src/javascript/page'),
      'less': resolve('src/less'),
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '../') }),
  ],
  module: {
    rules: [
      { 
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      { test: /\.ftl$/, loader: 'html-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.js$/, loader: 'babel-loader', include: [resolve('src')], options: { presets: ['es2015', 'stage-2'] } },
      { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url-loader', },
      { test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, loader: 'url-loader', },
    ]
  }
};
