var path = require('path');
var webpack = require('webpack');

var plugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    React: "react"
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/)
]


var config = {
  entry: {
    item_editor: [
      './client/src/item_editor.js'
    ]
  },
  output: {
    filename: 'bundle_[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.js$/,
      loaders: ['babel?stage=0'],
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
