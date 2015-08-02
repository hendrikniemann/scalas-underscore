// webpack.config.js
module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: 'bin',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /index\.js$/,
        loader: 'expose?_',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
    ],
  },
};
