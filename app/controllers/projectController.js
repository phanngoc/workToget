import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import {ioEmitter} from '../../io.js';
import {load_activity} from './helper_activity';

class ProjectController {
  constructor(...args) {
    this.args = args;
  }

  async index(ctx, next) {
    return ctx.render('projects.pug', {
      title: 'This is basecamp me!',
      baseUrl: process.env.BASE_URL
    });
  }

  async show(ctx, next) {
    let project = await models.Project.findOne({
      where: {
        id: ctx.params.id,
      }
    });
    ctx.body = {status: 200, data: project};
  }

  async getProjects(ctx, next) {
    let projects = await models.Project.findAll({
      where: {
        owner_id: ctx.params.id,
      }
    });
    ctx.body = {status: 200, projects: projects};
  }

  async trello(ctx, next) {
    return ctx.render('trello.pug', {
      title: 'This is basecamp me!',
      baseUrl: process.env.BASE_URL
    });
  }

  async getFrames(ctx, next) {
    let frames = await models.Frame.findAll({
      where: {
        project_id: ctx.params.id,
      },
      order: [
        ['order', 'ASC'],
        ['Tasks', 'order', 'ASC' ]
      ],
      include: [{
          model: models.Task,
          as: 'Tasks',
          attributes: Object.keys(models.Task.attributes).concat([
            [
            Sequelize.literal('(SELECT COUNT("comments.id") FROM comments WHERE comments.commentable="task" AND comments.commentable_id=Tasks.id)'),
            'countComment'
            ]
          ]),
          include: [
              {
                  model: models.Label,
                  as: 'Labels',
                  duplicating: true,
                  required: false,
              },
          ],
          group: ['tasks.id']
      }]
    });

    let countComments = [];
    ctx.body = {status: 200, data: {frames: frames, countComments: countComments}};
  }

  async deleteFrame(ctx, next) {
    let isDestroyed = models.Frame.findById(ctx.params.id)
      .tap((frame) => {
        return models.Task.destroy({
            where: {
              frame_id: frame.id
            }
        })
      })
      .tap(frame => frame.destroy());

    if (isDestroyed) {
      let data = {
        type: 'trello',
        deltas: ctx.params.id,
        typeName: 'archive_frame',
      }

      ioEmitter.to('project_' + ctx.params.project_id).emit('ARCHIVE_FRAME', data);
      ctx.body = {status: 200, data: isDestroyed};
    } else {
      ctx.body = errors.ServerError(isDestroyed);
    }
  }

  async updateFrame(ctx, next) {
    let updated = await models.Frame.update({ name: ctx.request.body.name},
        {where: { id: ctx.params.id }});

    let data = {
      type: 'trello',
      deltas: {id: ctx.params.id, name: ctx.request.body.name},
      typeName: 'update_frame',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('UPDATE_FRAME', data);

    ctx.body = {status: 200, data: updated};
  }

  async createFrame(ctx, next) {
    let max_order = await models.Frame.max('order', {where : {'project_id': ctx.params.project_id}});
    let frame = await models.Frame
        .create({
          name: ctx.request.body.name,
          order: max_order+1,
          project_id: ctx.params.project_id
        });

    let data = {
      type: 'trello',
      deltas: frame,
      typeName: 'add_frame',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('ADD_FRAME', data);

    ctx.body = {status: 200, data: frame};
  }

  async update(ctx, next) {
    let project = await models.Project.findOne({
      id: ctx.params.id
    });

    project.name = ctx.request.body.name;
    project.description = ctx.request.body.description;
    let result = await project.save().then(function(res){
      return res;
    }) ;
    ctx.body = {status: 200, result: result};
  }

  async updatePin(ctx, next) {
    let project = await models.Project.findOne({
      id: ctx.params.id
    });

    project.is_pinned = ctx.request.body.is_pinned;

    let result = await project.save().then(function(res){
      return res;
    }) ;
    ctx.body = {status: 200, result: result};
  }

  async updateSortFrame(ctx, next) {
    let result = await new Promise((resolve, reject) => {
      async.map(ctx.request.body.data, function(frame, callback) {
        models.Frame.update({order: frame.order}, {
          where: {
              id: frame.id
          }
        }).then(function(response) {
            callback(null, response);
        }).catch(function(error) {
            callback(error);
        });
      }, function(err, results) {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      });
    });

    if (result) {
      let data = {
        type: 'updateModels',
        deltas: ctx.request.body.data,
        typeName: 'update_sort_frame'
      }

      ioEmitter.to('project_' + ctx.params.id).emit('UPDATE_SORT_FRAME', data);
      ctx.body = {status: 200};
    } else {
      ctx.body = errors.ServerError;
    }
  }

  async updateSortTask(ctx, next) {
    let result = await new Promise((resolve, reject) => {
      async.map(ctx.request.body.data, function(task, callback) {
        models.Task.update({order: task.order, frame_id: ctx.request.body.frame_id}, {
          where: {
              id: task.id
          }
        }).then(function(response) {
            callback(null, response);
        }).catch(function(error) {
            callback(error);
        });
      }, function(err, results) {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      });
    })
    if (result) {
      let data = {
        type: 'updateModels',
        deltas: ctx.request.body.data,
        typeName: 'update_sort_task',
        frameId: ctx.request.body.frame_id
      }

      ioEmitter.to('project_' + ctx.params.id).emit('UPDATE_SORT_TASK', data);
      ctx.body = {status: 200};
    } else {
      ctx.body = errors.ServerError;
    }
  }

  async getLabels(ctx, next) {
    let labels = await models.Label.findAll({
      where: {
        project_id: ctx.params.id,
      }
    });
    ctx.body = {status: 200, data: labels};
  }

  async getActivities(ctx, next) {
    let results = await load_activity(ctx.params.project_id);
    ctx.body = {status: 200, data: results};
  }
};

export default ProjectController;
