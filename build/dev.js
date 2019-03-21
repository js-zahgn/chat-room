const webpack = require('webpack');
const config = require('./webpack.config');

config.mode = 'development';
config.output.publicPath = '';
config.plugins[0] = new webpack.HotModuleReplacementPlugin();
config.devServer = {
  hot: true,
  open: true,
  host: 'localhost',
  compress: true,
  inline: true,
  port: 2019,
  stats: {
    children: false,
    modules: false,
  }
};

module.exports = config;