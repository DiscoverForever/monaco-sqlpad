const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')
console.log(path.resolve('src/index.js'))
module.exports = {
  css: {
    extract: false
  },
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin({
      languages: ['sql', 'mysql', 'pgsql'],
      features: ['coreCommands', 'find']
    })]
  }
}
