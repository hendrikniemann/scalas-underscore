// webpack.config.js
module.exports = {
  entry: {
    tests: './spec/tests.js',
  },
  output: {
    path: 'bin',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
    ],
  },
};