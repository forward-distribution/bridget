
const path = require('path')
const libraryName = 'bridget'
const outputFile = `${libraryName}.js`
module.exports = {
  entry: './src/bridget.js',
  output: {
    library: {
      name: libraryName,
      type: 'window'
    },
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: outputFile,
    globalObject: 'typeof window !== undefined ? window : this',
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
