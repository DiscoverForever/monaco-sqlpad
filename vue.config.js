const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')
console.log(path.resolve('src/index.js'))
module.exports = {
  productionSourceMap: false,
  css: {
    extract: false,
    sourceMap: false
  },
  publicPath: './',
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['sql'],
        features: [],
        publicPath: '/'
      })
    ]
  }
}
