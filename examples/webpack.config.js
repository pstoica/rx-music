var path = require('path');

module.exports = {
  devtool: 'eval',
  entry: {
    1: './1.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader?experimental&optional=runtime',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      'RM': '../src'
    }
  }
};
