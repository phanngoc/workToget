import HomeController from '../controllers/homeController';

module.exports = function(app) {
  var Router    = require('koa-router');
  var homeController = new HomeController;

  var router = new Router();

  router.get('/', homeController.index);

  router.get('/projects', homeController.getProjects);

  app.use(router.routes()).use(router.allowedMethods());
};
