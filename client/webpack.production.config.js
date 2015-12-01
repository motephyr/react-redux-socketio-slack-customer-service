var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  new ExtractTextPlugin('react-toolbox.css', {
    allChunks: true
  }),
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
    app: [
      './client/src/app.js'
    ]
  },
  output: {
    filename: 'bundle_[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [{
      test: /(\.js|\.jsx)$/,
      loaders: ['babel?stage=0'],
      include: path.join(__dirname, 'src')
    }, {
      test: /(\.scss|\.css)$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox')
    }]
  },
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],
    modulesDirectories: ["node_modules", "bower_components"],
    root: path.resolve(__dirname, './src')
  },
  toolbox: {
    theme: path.join(__dirname, 'css/toolbox-theme.scss')
  },
  postcss: [autoprefixer],
  plugins: plugins
};

module.exports = config;
