const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  externals: [
    /^@noriginmedia\/norigin-spatial-navigation-(\w+)?$/,
    'react',
    /^lodash(\/.+)?$/
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), 'dist'),
    libraryTarget: 'umd',
    clean: true,
    globalObject: 'this'
  }
};
