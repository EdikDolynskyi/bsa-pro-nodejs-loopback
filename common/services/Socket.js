var io = require('socket.io')();
io.on('connection', function(client){});

module.exports = io;