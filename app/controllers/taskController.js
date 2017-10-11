import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';

class TaskController {
  constructor(...args) {
    this.args = args;
  }

  async updateTask(ctx, next) {
    let task = await models.Task.findOne({
      id: ctx.params.id
    });

    task.title = ctx.request.body.title;
    task.description = ctx.request.body.description;

    let result = await task.save().then(function(res){
      return res;
    }) ;
    ctx.body = {status: 200, result: result};
  }

  async getListCommentTask(ctx, next) {
    let comments = await models.Comment.findAll({
      where: {
        commentable_id: ctx.params.id,
        commentable: 'task'
      }
    });
    ctx.body = {status: 200, result: comments};
  }

  async addCommentTask(ctx, next) {
    let task = await models.Task.find({
      where: {
        id: ctx.params.id,
      }
    });

    let comment = task.createComment({
      content: this.request.body.content,
      user_id: ctx.request.state.user,
    })

    ctx.body = {status: 200, result: comment};
  }
};

export default TaskController;
