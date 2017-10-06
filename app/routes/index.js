import HomeController from '../controllers/homeController';
import ProjectController from '../controllers/projectController';
import passport from 'koa-passport';
import {isAuthenticated} from '../lib/auth';
import {authenticate} from '../controllers/middleware';
import debug from 'debug';


module.exports = function(app) {
  var Router    = require('koa-router');
  var homeController = new HomeController;
  var projectController = new ProjectController;

  var router = new Router();

  router.get('/:id/projects', projectController.index);

  router.get('/seed', homeController.seed);

  router.get('/login', homeController.login);

  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), homeController.postLogin);

  router.get('/', homeController.index);

  router.get('/projects/:id/trello', projectController.trello);

  router.get('/api/:id/projects', projectController.getProjects);

  router.get('/api/projects/:id/frames', projectController.getFrames);

  router.post('/api/projects/:id/update', projectController.update);

  router.put('/api/projects/:id/update-pin', projectController.updatePin);

  app.use(router.routes()).use(router.allowedMethods());
};
