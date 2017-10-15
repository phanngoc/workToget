

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

// ioEmitter.redis.on('error', onError);

// function onError(err){
//   console.log(err);
// }

let wrapIo = function (server) {
  const io = require('socket.io')(server);
  const redis = require('socket.io-redis');

  io.adapter(redis({ host: '127.0.0.1', port: 6379, subClient: sub, pubClient: pub}));

  io.of('/').adapter.clients((err, clients) => {
    console.log('list clients', clients); // an array containing all connected socket ids
  });

  io.in('UPDATE_MODELS').clients((err, clients) => {
    console.log('UPDATE_MODELS in', clients); // an array containing socket ids in 'room3'
  });

  io.of('/').adapter.clients(['UPDATE_MODELS'], (err, clients) => {
    console.log("adapter.clients", clients); // an array containing socket ids in 'room1' and/or 'room2'
  });

  io.of('/').adapter.allRooms((err, rooms) => {
    console.log("adapter.allRooms", rooms); // an array containing all rooms (accross every node)
  });

  io.on('connection', function(socket) {
    console.log("io connection");
    socket.on('UPDATE_MODELS', data => {
      console.log('co data gui len', data);
      socket.emit('UPDATE_MODELS', 'an event sent to all connected clients' + data);
    })
  });

  return io;
}

export {ioEmitter, wrapIo};
