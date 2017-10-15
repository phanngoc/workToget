import HomeController from '../controllers/homeController';
import ProjectController from '../controllers/projectController';
import TaskController from '../controllers/taskController';
import passport from 'koa-passport';
import {isAuthenticated} from '../lib/auth';
import {authenticate, authenticateUsernameAndPass, authenticateTokenGetUser} from '../controllers/middleware';
import debug from 'debug';
import jwt from 'koa-jwt';
import mount from 'koa-mount';
import compose from 'koa-compose';
import Router from 'koa-router';

module.exports = function(app) {

  var homeController = new HomeController;
  var projectController = new ProjectController;
  var taskController = new TaskController;

  var router = new Router();
  var apiRouter = new Router();

  router.get('/:id/projects', projectController.index);

  router.get('/seed', homeController.seed);

  // router.get('/login', homeController.login);

  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), homeController.postLogin);

  router.post('/authenticate', authenticateUsernameAndPass);

  router.get(/^\/(.*)(?:\/|$)/, homeController.index);

  // app.use(jwt({ secret: process.env.SECRET }).unless({ path: ["[^\/api/]"] }));

  apiRouter.get('/user', authenticateTokenGetUser);

  apiRouter.get('/:id/projects', projectController.getProjects);

  apiRouter.put('/task/:id/update', taskController.updateTask);

  apiRouter.get('/task/:id/comments', taskController.getListCommentTask);

  apiRouter.post('/task/:id/comment', taskController.addCommentTask);

  apiRouter.put('/task/comment/:id', taskController.updateCommentTask);

  apiRouter.put('/task/:id/update-due-date', taskController.updateDueDate);

  apiRouter.delete('/task/:id/delete', taskController.deleteLabel);

  apiRouter.put('/labels/:id/update', taskController.updateLabel);

  apiRouter.put('/task/:id/update-label', taskController.updateTaskLabel);

  apiRouter.get('/projects/:id/frames', projectController.getFrames);

  apiRouter.get('/projects/:id/labels', projectController.getLabels);

  apiRouter.post('/projects/:id/update', projectController.update);

  apiRouter.post('/projects/:id/update-sort-frame', projectController.updateSortFrame);

  apiRouter.post('/projects/update-sort-task', projectController.updateSortTask);

  apiRouter.put('/projects/:id/update-pin', projectController.updatePin);


  app.use(mount('/api', compose([jwt({secret: process.env.SECRET}), apiRouter.middleware(), apiRouter.allowedMethods()])));
  app.use(mount('/', router.middleware(), router.allowedMethods()));
};
