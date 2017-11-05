var redis = require("redis");
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = redis.createClient();

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
    console.log('fire connect');
    socket.emit('server_connect');

    socket.on('disconnect', (reason) => {
      console.log('disconnect', reason);
    });

    socket.on('ADD_ID_CONNECT', (userId) => {
      console.log('ADD_ID_CONNECT', userId, socket.id);
      client.hmset("socket_ids" ,
        [userId, socket.id], function (err, res) {
          console.log('response ne:', res, err);
        });
    });

    socket.on('JOIN_PROJECT', (projectId, userId) => {
      socket.join('project_' + projectId, () => {
        let rooms = Object.keys(socket.rooms);
      });
    });
  });

  return io;
}

export {ioEmitter, wrapIo};
