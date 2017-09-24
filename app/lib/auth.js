import passport from 'koa-passport';

export function isAuthenticated() {
  return passport.authenticate('local');
}
