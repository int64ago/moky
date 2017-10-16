const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;
const PROD = env === 'production' ? true : false;

module.exports = env => {
    const webpackConfig = merge(baseWebpackConfig, {
      devtool: false,
      module: {
        rules: [
          { test: /\.css$/, loader: ExtractTextPlugin.extract({ use: 'css-loader', fallback: 'style-loader' }) },
          { test: /\.less$/, loader: ExtractTextPlugin.extract({ use: [{ loader: 'css-loader'}, { loader: 'less-loader'}], fallback: 'style-loader' }) },
          { test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/, loader: 'file-loader', options: { name: '/font/[name].[ext]' } }
        ]
      },
      plugins: [
        // extract css into its own file
        new ExtractTextPlugin(PROD ? 'css/[name]-[contenthash].css' : 'css/[name].css'),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        }),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, '../templates/index.html'),
          filename: 'index.html',
          inject: true,
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
          chunksSortMode: 'dependency'
        }),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: (module, count) => {
            // any required modules inside node_modules are extracted to vendor
            return (
              module.resource && /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                path.join(__dirname, '../node_modules')
              ) === 0
            )
          }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          chunks: ['vendor']
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          sourceMap: true
        }),
      ]
    })

    if (env && env.analyze) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    }
    return webpackConfig;
};
