const { webpack } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const version = require('../package.json').version;

module.exports = merge(baseConfig, reactConfig, {
  output: {
    path: resolve(__dirname, '../app', '../app/build'),
    filename: 'bundle.[name].[contenthash].js',
  },
  mode: 'production',
  optimization: {
    moduleIds: 'named',
    minimizer: [new TerserPlugin({ test: /\.js(\?.*)?$/i })],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](?!jspdf)[a-zA-Z0-9-._]+[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify(version),
    }),
  ],
});
