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

var app = new Koa();

app.use(views(config.template.path, config.template.options));
app.use(bodyParser());

app.keys = ['bombay'];
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

require('./app/routes')(app);

if (!module.parent) app.listen(3000);
