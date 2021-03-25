
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/bridget.js',
  output: {
    library: 'bridget',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: 'bridget.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map'
}
