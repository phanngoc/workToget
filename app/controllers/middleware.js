import moment from 'moment';
import _ from 'lodash';
import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';

const {
  User
} = models;

export async function authenticate(ctx, next) {
  let test = await passport.authenticate('local',
    function(err, user, info, status) {
      if (user === false) {
        ctx.body = { success: false }
        ctx.throw(401)
      } else {
        ctx.body = { success: true }
        return ctx.login(user)
      }
    }
    )(ctx, next);
  return test;
}

function getToken(user) {
  return {
    token: user.jwt(user),
  }
}

async function verifyUser(username, password) {
  return new Promise((resolve, reject) => {
    User.auth(username, password, function(error, user) {
      if (error) return reject(error);
      resolve({status:200, data: {access_token: user.jwt(user), user: user}});
    });
  });
}

export async function authenticateUsernameAndPass(ctx, next) {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  if (username && password) {
    let result = await verifyUser(username, password);
    ctx.body = result;
  } else {
    ctx.body = errors.ValidationFailed();
  }
}

export async function authenticateTokenGetUser(ctx, next) {
  let user = await User.findOne({ where: {id: ctx.state.user.id} }).then(user => {
    return user;
  })
  ctx.body = {status: 200, data: {user: user}};
}
