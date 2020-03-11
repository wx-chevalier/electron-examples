const path = require('path');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin');
const merge = require('webpack-merge');

const config = merge(
  require('@wx-fc/webpack-config/webpack.config.node')({
    rootPath: path.resolve(__dirname, '../../'),
  }),
  {
    target: 'electron-main',
    plugins: [
      new CopyPkgJsonPlugin({
        remove: ['scripts', 'devDependencies', 'build'],
        replace: {
          scripts: { start: 'electron ./index.js' },
          postinstall: 'electron-builder install-app-deps',
        },
      }),
    ],
  },
);

console.log(config);
module.exports = config;
