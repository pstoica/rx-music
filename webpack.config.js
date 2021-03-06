var path = require('path');

module.exports = {
  devtool: 'eval',
  entry: './src/index.js',
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
    filename: 'bundle.js'
  }
};
