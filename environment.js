module.exports = {

  loadSocketIo: function loadSocketIo(server) {

    var io = require('socket.io').listen(server);
    io.on('connection', function (socket) {
      require('./controller/socket.js')(socket,io);
    });

    return io;
  },

  authorize: function authorize(io) {
    io.use(function (socket, next) {

      var userId = null;

      var url = require('url');
      requestUrl = url.parse(socket.request.url);
      requestQuery = requestUrl.query;
      requestParams = requestQuery.split('&');
      params = {};
      for (i = 0; i <= requestParams.length; i++) {
        param = requestParams[i];
        if (param) {
          var p = param.split('=');
          if (p.length != 2) {
            continue
          };
          params[p[0]] = p[1];
        }
      }

      userId = params["_rtUserId"];
      socket.request.session = {
        "user_id": userId
      };
      next();
    });
  },
}
