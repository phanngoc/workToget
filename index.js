require('babel-core/register');

import { Strategy as LocalStrategy } from 'passport-local';
import bodyParser from 'koa-body';
import session from 'koa-session';
import passport from 'koa-passport';
import Koa from 'koa';
import path from 'path';
import views from 'koa-views';
import config from 'config';
import serve from 'koa-static';
import models from './models';
import dotenv from 'dotenv';
import nodemon from 'nodemon';
import {ioEmitter, wrapIo} from './io';
import logger from 'koa-logger';

dotenv.config();

const {
  User
} = models;

var app = new Koa();

app.keys = ['bombay'];
app.use(session({}, app));
// app.use(logger());
app.use(views(config.template.path, config.template.options));
app.use(bodyParser({multipart: true}));
app.use(serve('./public'));

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  },
  async function(req, username, password, done) {
    let result = await User.auth(username, password, function(error, user) {
      if (error) { return done(error); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj)
});

app.use(passport.initialize());
app.use(passport.session());

require('./app/routes')(app);

let terminator = function(sig){
    if (typeof sig === "string") {
       console.log('%s: Received %s - terminating sample app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
};

// then implement it for every process signal related to exit/quit
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
});

var server = require('http').createServer(app.callback());
app.context.io = wrapIo(server);

// var io = require('socket.io')(server);

// io.on('connection', function(socket){
//   console.log("io connection");
//   socket.on('emit_method', data => {
//     console.log('co data gui len', data);
//     socket.emit('EMIT_METHOD', 'an event sent to all connected clients' + data);
//   })
// });


if (!module.parent) server.listen(3000).on('error', (err) => {
  if (err.errno === 'EADDRINUSE') {
    console.error('Error: Port busy', err);
    process.exit(1);
  } else
    console.log(err);
});
