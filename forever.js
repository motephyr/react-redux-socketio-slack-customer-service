var forever = require('forever-monitor');

var child = new(forever.Monitor)('realtime-server.js', {
    //max: 3,
    silent: false,
    options: []
});

child.on('exit', function() {
    console.log('realtime-server has exited.');
});

child.start();