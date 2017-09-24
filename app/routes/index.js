import HomeController from '../controllers/homeController';
import passport from 'koa-passport';
import {isAuthenticated} from '../lib/auth';
import {authenticate} from '../controllers/middleware';
import debug from 'debug';

module.exports = function(app) {
  var Router    = require('koa-router');
  var homeController = new HomeController;

  var router = new Router();

  // router.get('/projects', homeController.getProjects);

  router.get('/login', homeController.login);

  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), homeController.postLogin);

  router.get('/', homeController.index);

  app.use(router.routes()).use(router.allowedMethods());
};
