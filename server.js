var Express = require('express'),
  App = Express(),
  Http = require('http');
var server = Http.createServer(App).listen(3000);

var Environment = require('./environment.js');
//var redis = environment.loadRedis();
var Io = Environment.loadSocketIo(server);

Environment.authorize(Io);

App.use('/', Express.static(__dirname));
App.use('/dist', Express.static(__dirname + '/client/dist'));

App.use('/js', Express.static(__dirname + '/assets/javascripts'));
App.use('/css', Express.static(__dirname + '/assets/stylesheets'));
App.use('/image', Express.static(__dirname + '/assets/images'));

App.get('/:project', function (req, res, next) {
  var project = req.params.project;
  res.sendFile(__dirname + '/public/' + project + '.html');
});



// processENV = process.env.NODE_ENV || "development"

// if (processENV === "development") {
//   console.log(processENV);
//   //---------------------------------------deploy
//   var Webpack = require('webpack');
//   var config = require('./client/webpack.dev.config.js');

//   var compiler = Webpack(config);

//   App.use(require('webpack-dev-middleware')(compiler, {
//     noInfo: true,
//     publicPath: config.output.publicPath
//   }));
// console.log(config.output.publicPath);
//   App.use(require('webpack-hot-middleware')(compiler));
// }
