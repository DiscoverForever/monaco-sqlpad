const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
      }),
      new CopyWebpackPlugin(
        {
          patterns: [
            {
              context: 'node_modules/monaco-editor',
              from: '*',
              to: '[name].[ext]',
              toType: 'template'
            }
          ]
        }
      )
    ]
  }
}
