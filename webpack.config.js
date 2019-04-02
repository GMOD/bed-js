var path = require('path');

module.exports = {
  output: {
		path: path.resolve(__dirname, 'dist'),
    library: 'BED',
    libraryTarget: 'commonjs'
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
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
