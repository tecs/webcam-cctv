module.exports = {
  mode: 'development',
  entry: `${__dirname}/src/frontend/App.js`,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: `${__dirname}/public`,
    publicPath: '/',
  },
  plugins: [],
};
