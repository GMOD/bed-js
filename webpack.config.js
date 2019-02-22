module.exports = {
  module: {
    rules: [
      {
        test: /\.as$/i,
        use: 'raw-loader',
      },
    ],
  },
};
