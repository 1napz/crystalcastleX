const path = require('path');

module.exports = {
  packages: ['packages/*'],
  webpackConfig: path.resolve(__dirname, 'webpack.base.js'),
  parallel: true,
  cache: true,
};