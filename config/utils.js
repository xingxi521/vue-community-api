const path = require('path')

exports.resolve = function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

exports.APP_PATH = exports.resolve('')
exports.DIST_PATH = exports.resolve('dist')
exports.SRC_PATH = exports.resolve('src')
