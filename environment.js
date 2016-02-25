var Config = require('config');

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
      var formDomain = null;

      var url = require('url');
      requestUrl = url.parse(socket.request.url);
      // console.log("following is Request Info:");
      // console.log(socket.request);
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
      fromDomain = params["_rtDom"];
      // socket.request.session = {
      //   "user_id": userId,
      //   "from_domain": fromDomain
      // };
      socket.username = userId;
      socket.currentDomain = fromDomain;
      next();
    });
  },
}
