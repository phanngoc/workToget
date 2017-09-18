import HomeController from '../controllers/homeController';

module.exports = function(app) {
  var Router    = require('koa-router');
  var homeController = new HomeController;

  var router = new Router();

  router.get('/', homeController.index);

  router.get('/projects', homeController.getProjects);

  router.post('/login', function(ctx) {
      return passport.authenticate('local', function(err, user, info, status) {
        if (user === false) {
          ctx.body = { success: false }
          ctx.throw(401)
        } else {
          ctx.body = { success: true }
          return ctx.login(user)
        }
      })(ctx)
  });

  app.use(router.routes()).use(router.allowedMethods());
};
