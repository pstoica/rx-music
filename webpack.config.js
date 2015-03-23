module.exports = {
  devtool: 'eval',
  entry: './entry',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};
