module.exports = {
  devtool: 'eval',
  entry: './entry.js',
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
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};
