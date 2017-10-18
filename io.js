

var redis = require("redis");
var sub = redis.createClient(), pub = redis.createClient();
var msg_count = 0;

sub.on("subscribe", function (channel, count) {
    console.log(channel, count);
});

sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
});

// sub.subscribe("UPDATE_MODELS");

let ioEmitter = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
// var socket = ioEmitter.of('/namespace');
// socket.emit('message', 'Hi you!');

ioEmitter.redis.on('error', onError);

function onError(err){
  console.log(err);
}

let wrapIo = function (server) {
  const io = require('socket.io')(server);
  const redis = require('socket.io-redis');

  io.adapter(redis({ host: '127.0.0.1', port: 6379, subClient: sub, pubClient: pub}));

  io.on('connection', function(socket) {
    console.log("io connection");
    socket.on('UPDATE_MODELS', data => {
      socket.emit('UPDATE_MODELS', 'an event sent to all connected clients' + data);
    });

    socket.on('JOIN_PROJECT', projectId => {
      socket.join('project_' + projectId, () => {
        let rooms = Object.keys(socket.rooms);
        console.log('JOIN_PROJECT', rooms);  // [ <socket.id>, 'room 237' ]
      });
    });
  });

  return io;
}

export {ioEmitter, wrapIo};
