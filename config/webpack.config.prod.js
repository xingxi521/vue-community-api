const webpackMerge = require('webpack-merge')
const webpackBase = require('./webpack.config.base')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const webpackConfig = webpackMerge.merge(webpackBase, {
  mode: 'production',
  // 日志消息不传递出来
  stats: { children: false, warnings: false },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            // 是否注释掉console
            drop_console: false,
            dead_code: true,
            drop_debugger: true
          },
          output: {
            comments: false,
            beautify: false
          },
          mangle: true
        },
        parallel: true
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true
        }
      }
    }
  }
})
module.exports = webpackConfig
