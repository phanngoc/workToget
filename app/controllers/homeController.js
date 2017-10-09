import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';
import seed from '../utils';

class HomeController {
  constructor(...args) {
    this.args = args;
  }

  async seed(ctx, next) {
    seed();
  }

  async index(ctx, next) {
    return ctx.render('index.pug', {
      title: 'This is title',
      baseUrl: process.env.BASE_URL
    });
  }

  async login(ctx, next) {
    return ctx.render('login.pug', {
      title: 'Login page',
      baseUrl: process.env.BASE_URL
    });
  }

  async postLogin(ctx, next) {
    return ctx.redirect('/');
  }

};

export default HomeController;
