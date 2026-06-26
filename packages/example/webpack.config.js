module.exports = {
  entry: './src/browser.ts',
  output: {
    filename: 'example.bundle.js',
    library: { name: 'ExampleLib', type: 'umd' },
  },
  externals: { lodash: '_' },
};