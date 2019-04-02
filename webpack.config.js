var path = require('path');

module.exports = {
  output: {
		path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
	},
  module: {
    rules: [
      {
        test: /\.as$/i,
        use: 'raw-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: false
  }
}
