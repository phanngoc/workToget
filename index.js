require('babel-core/register');

import { Strategy as LocalStrategy } from 'passport-local';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import Koa from 'koa';
import path from 'path';
import views from 'koa-views';
import config from 'config';
import serve from 'koa-static';
import models from './models';
const {
  User
} = models;

var app = new Koa();

app.keys = ['bombay'];
app.use(session({}, app));

app.use(views(config.template.path, config.template.options));
app.use(bodyParser());
app.use(serve('./public'));



passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  },
  async function(req, username, password, done) {
    // request object is now first argument
    console.log('new LocalStrategy', req);
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

// process.on('SIGUSR2', () => {
//   console.log('SIGUSR2');
//   // process.exit(1);
// });

// process.on('SIGINT', function() {
//   console.log('SIGINT');
//   // process.exit(1);
// });



if (!module.parent) app.listen(3000).on('error', (err) => {
  if (err.errno === 'EADDRINUSE') {
    console.error('Error: Port busy', err);
    process.exit(1);
  } else
    console.log(err);
});
