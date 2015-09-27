var environment = require('./environment.js');
//var redis = environment.loadRedis();
var io = environment.loadSocketIo();

environment.authorize(io);