const webpackMerge = require('webpack-merge')
const webpackBase = require('./webpack.config.base')
const webpackConfig = webpackMerge.merge(webpackBase, {
  mode: 'development',
  devtool: 'eval-source-map',
  // 日志消息不传递出来
  stats: { children: false }
})
module.exports = webpackConfig
