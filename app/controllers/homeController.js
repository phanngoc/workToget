import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';

class HomeController {
  constructor(...args) {
    this.args = args;
  }

  async index(ctx, next) {
    debug('http')('asdasd');
    return ctx.render('index.pug', {
      title: 'This is title'
    });
  }

  async login(ctx, next) {
    return await ctx.render('login.pug').then(function(results) {
      return results;
    });
  }

  async postLogin(ctx, next) {
    return ctx.redirect('/');
  }

  // async getProjects(next) {

  // }
};

export default HomeController;
