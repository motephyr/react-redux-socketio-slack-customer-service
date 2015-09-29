var Express = require('express'),
  App = Express(),
  Http = require('http');
Http.createServer(App).listen(8080);


var Environment = require('./environment.js');
//var redis = environment.loadRedis();
var Io = Environment.loadSocketIo();

Environment.authorize(Io);


App.use('/js', Express.static(__dirname + '/assets/javascripts'));
App.use('/css', Express.static(__dirname + '/assets/stylesheets'));
App.use('/image', Express.static(__dirname + '/assets/images'));

App.get('/:project', function (req, res, next) {
  var project = req.params.project;
  res.sendFile(__dirname + '/public/' + project + '.html');
});
