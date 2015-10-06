var path = require('path');
var webpack = require('webpack');

var plugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    React: "react"
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
  new webpack.NoErrorsPlugin()
]

var assets_path = "client/dist";
var assets_slash_path = "/"+assets_path+"/";


var config = {
  entry: {
    item_editor: [
      'webpack-hot-middleware/client?' + assets_slash_path,
      './client/src/item_editor.js'
    ]
  },
  output: {
    filename: 'bundle_[name].js',
    path: path.resolve(__dirname, assets_path),
    publicPath: assets_slash_path
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.js$/,
      loaders: ['react-hot', 'babel?stage=0'],
      include: path.join(__dirname, 'src')
    }]
  },
  resolve: {
    modulesDirectories: ["node_modules", "bower_components"],
    root: path.resolve(__dirname, './src')
  },
  plugins: plugins
};

module.exports = config;
