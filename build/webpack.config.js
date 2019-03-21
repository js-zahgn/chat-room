const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/main.js'),
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'file-loader',
        include: [path.resolve(__dirname, '../src/fonts')],
        options: {
          name: 'fonts/[name]-[hash:8].[ext]',
          publicPath: '../'
        }
      },
      {
        test: /\.(jpg|gif|png|svg)$/,
        exclude: [path.resolve(__dirname, '../src/fonts')],
        use: [{
          loader: 'file-loader',
          options: {
            limit: 8192,
            name: 'images/[name]-[hash:8].[ext]',
            publicPath: '../'
          }
        }]
      }
    ]
  },
  plugins: [
    new cleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    new MiniCssExtractPlugin({ filename: 'style/[name]-[hash:8].css' }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }],
      },
      canPrint: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      favicon: 'src/images/favicon.ico'
    }),
    new webpack.HashedModuleIdsPlugin() // 根据模块的相对路径生成 HASH 作为模块ID
  ],
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'initial', // 默认 async 可选值 all 和 initial
  //     maxInitialRequests: Infinity, // 一个入口最大的并行请求数
  //     minSize: 0, // 避免模块体积过小被忽略
  //     minChunks: 1, // 表示最小引用次数
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/, // 如果依赖比较小，可以直接设置成需要打包的依赖名称
  //         name(mod, chunks, cacheGroupKey) { // 可提供布尔值、字符串和函数，如果是函数，可编写自定义返回值
  //           const packageName = mod.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]; // 获取模块名称
  //           return `npm-${packageName}`; 
  //         },
  //         priority: 10,
  //         enforce: true
  //       }
  //     }
  //   }
  // },
  stats: {
    children: false,
    modules: false
  }
};