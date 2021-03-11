
const path = require('path');

const include = path.join(__dirname, 'src')

module.exports = {
  mode: 'production',
  entry: './src/bridget.js',
  output: {
    library: 'bridget',
    libraryTarget: 'umd',
    filename: 'bridger.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  devtool:"source-map",
}