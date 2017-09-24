import moment from 'moment';
import _ from 'lodash';
import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';

const {
  User
} = models;

export async function authenticate(ctx, next) {
  // console.log('authenticate', ctx.request);

  // return await passport.authenticate('local', function(err, user, info, status) {
  //   console.log(err, user, info, status);
  //   if (user === false) {
  //     ctx.body = { success: false }
  //     ctx.throw(401)
  //   } else {
  //     ctx.body = { success: true }
  //     return ctx.login(user)
  //   }
  // })(ctx);
  let test = await passport.authenticate('local',
    function(err, user, info, status) {
      console.log(err, user, info, status);
      if (user === false) {
        ctx.body = { success: false }
        ctx.throw(401)
      } else {
        ctx.body = { success: true }
        return ctx.login(user)
      }
    }
    )(ctx, next);
  console.log('authenticate', test);
  return test;
}

