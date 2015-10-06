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

var assets_path = "dist";
var assets_host = "http://localhost:8080/"+assets_path;


var config = {
  entry: {
    item_editor: [
      'webpack-dev-server/client?' + assets_host,
      'webpack/hot/only-dev-server',
      './client/src/item_editor.js'
    ]
  },
  output: {
    filename: 'bundle_[name].js',
    path: path.resolve(__dirname, assets_path),
    publicPath: assets_host
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
