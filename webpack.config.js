
const path = require('path')

module.exports = {
  // uncomment if you want to see more output
  // mode: 'development',
  // optimization: {
  //   usedExports: true
  // },
  entry: './src/bridget.js',
  output: {
    library: {
      name: 'bridget',
      type: 'window'
    },
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
