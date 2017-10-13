const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

module.exports = merge(baseWebpackConfig, {
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [
        { test: /\.css$/, use: [{ loader: 'style-loader'}, { loader: 'css-loader' }] },
        { test: /\.less$/, use: [{ loader: 'style-loader'}, { loader: 'css-loader' }, { loader: 'less-loader' }] },
    ]
  },
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, '../templates/index.html'),
        filename: 'index.html',
        inject: true,
    }),
  ]
});
