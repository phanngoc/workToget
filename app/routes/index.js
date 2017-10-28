import HomeController from '../controllers/homeController';
import ProjectController from '../controllers/projectController';
import TaskController from '../controllers/taskController';
import ChatController from '../controllers/chatController';
import CalendarController from '../controllers/calendarController';

import passport from 'koa-passport';
import {isAuthenticated} from '../lib/auth';
import {authenticate, authenticateUsernameAndPass, authenticateTokenGetUser} from '../controllers/middleware';
import {uploadMiddeware, processUploadMiddleware} from '../controllers/uploadMiddeware';
import debug from 'debug';
import jwt from 'koa-jwt';
import mount from 'koa-mount';
import compose from 'koa-compose';
import Router from 'koa-router';

module.exports = function(app) {

  var homeController = new HomeController;
  var projectController = new ProjectController;
  var taskController = new TaskController;
  var chatController = new ChatController;
  var calendarController = new CalendarController;

  var router = new Router();
  var apiRouter = new Router();

  // router.get('/:id/projects', projectController.index);

  router.get('/seed', homeController.seed);

  // router.get('/login', homeController.login);

  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), homeController.postLogin);

  router.post('/authenticate', authenticateUsernameAndPass);

  router.get(/^\/(.*)(?:\/|$)/, homeController.index);

  apiRouter.post('/upload', processUploadMiddleware);

  apiRouter.get('/user', authenticateTokenGetUser);

  apiRouter.get('/:id/projects', projectController.getProjects);

  apiRouter.get('/projects/:id', projectController.show);

  /* Route for chat */
  apiRouter.get('/projects/:project_id/messages', chatController.loadMessages);

  apiRouter.post('/projects/:project_id/messages/create', chatController.createMessage);

  apiRouter.delete('/projects/:project_id/messages/:id/delete', chatController.deleteMessage);

  /* Route for trello */

  apiRouter.delete('/projects/:project_id/frames/:id/delete', projectController.deleteFrame);

  apiRouter.put('/projects/:project_id/frames/:id/update', projectController.updateFrame);

  apiRouter.post('/projects/:project_id/frames', projectController.createFrame);

  apiRouter.post('/projects/:project_id/tasks', taskController.createTask);

  apiRouter.get('/projects/:id/frames', projectController.getFrames);

  apiRouter.get('/projects/:id/labels', projectController.getLabels);

  apiRouter.post('/projects/:id/update', projectController.update);

  apiRouter.post('/projects/:id/update-sort-frame', projectController.updateSortFrame);

  apiRouter.post('/projects/:id/update-sort-task', projectController.updateSortTask);

  apiRouter.put('/projects/:id/update-pin', projectController.updatePin);

  apiRouter.put('/task/:id/update', taskController.updateTask);

  apiRouter.get('/task/:id/comments', taskController.getListCommentTask);

  apiRouter.post('/task/:id/comment', taskController.addCommentTask);

  apiRouter.put('/task/comment/:id', taskController.updateCommentTask);

  apiRouter.put('/projects/:project_id/task/:id/update-due-date', taskController.updateDueDate);

  apiRouter.delete('/task/:id/delete', taskController.deleteLabel);

  apiRouter.put('/projects/:project_id/labels/:id/update', taskController.updateLabel);

  apiRouter.put('/projects/:project_id/task/:id/update-label', taskController.updateTaskLabel);

  /* Route for calendar */
  apiRouter.get('/projects/:project_id/calendars/events', calendarController.loadEvents);
  apiRouter.get('/projects/:project_id/calendars/users', calendarController.loadUserBelongProject);
  apiRouter.post('/projects/:project_id/calendars/events/create', calendarController.createEvent);
  apiRouter.put('/projects/:project_id/calendars/events/:id/update', calendarController.updateEvent);
  apiRouter.del('/projects/:project_id/calendars/events/:id/archive', calendarController.archiveEvent);

  app.use(mount('/api', compose([jwt({secret: process.env.SECRET}), apiRouter.middleware(), apiRouter.allowedMethods()])));
  app.use(mount('/', router.middleware(), router.allowedMethods()));
};
