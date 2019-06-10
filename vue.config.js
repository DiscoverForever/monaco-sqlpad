const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')
module.exports = {
  configureWebpack: {
    entry: process.env.NODE_ENV === 'production' ? path.resolve('src/index.js') : path.resolve('src/main.js'),
    output: {
      library: 'monaco-sqlpad',
      filename: 'sqlpad.min.js',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    plugins: [new MonacoWebpackPlugin()]
  }
}
