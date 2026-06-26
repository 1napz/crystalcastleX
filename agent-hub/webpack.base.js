module.exports = {
  mode: 'production',
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, use: 'swc-loader' },
    ],
  },
  output: { filename: 'index.js', library: { type: 'commonjs2' } },
};