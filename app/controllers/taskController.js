import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';

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
      order: [
        ['created_at', 'DESC'],
      ],
      where: {
        commentable_id: ctx.params.id,
        commentable: 'task'
      },
      include: [{
          model: models.User,
          as: 'User',
          required: true
      }]
    });
    ctx.body = {status: 200, data: comments};
  }

  /**
   * [addCommentTask description]
   * @param  {[type]}   ctx  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   */
  async addCommentTask(ctx, next) {
    let task = await models.Task.find({
      where: {
        id: ctx.params.id,
      }
    });

    let comment = await task.createComment({
      content: ctx.request.body.content,
      user_id: ctx.request.body.user_id,
    });

    let user = await comment.getUser();

    comment = comment.toJSON();
    user = user.toJSON();

    comment.User = user;
    ctx.body = {status: 200, data: comment};
  }

  /**
   * [updateCommentTask description]
   * @param  {[type]}   ctx  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   */
  async updateCommentTask(ctx, next) {
    let comment = await models.Comment.findOne({
      where: {id: ctx.params.id}
    });

    comment.content = ctx.request.body.content;

    let result = await comment.save().then(function(res){
      return res;
    });

    let user = await comment.getUser();

    comment = comment.toJSON();
    user = user.toJSON();

    comment.User = user;

    ctx.body = {status: 200, data: comment};
  }

  async updateDueDate(ctx, next) {
    let task = await models.Task.findOne({
      where: {id: ctx.params.id}
    });

    if (_.isUndefined(ctx.request.body.due_date)) {
      ctx.body = errors.ValidationFailed();
      return;
    } else {
      let result = await models.Task.update({ due_date: ctx.request.body.due_date }, { where: { id: ctx.params.id } })
        .then((count) => {
          if (count) {
            return count;
          }
        });
      ctx.body = {status: 200, data: result};
    }
  }

  async deleteLabel(ctx, next) {
    let label = await models.Label.findOne({
      where: {id: ctx.params.id}
    });
    try {
      let isRemoveAss = label.setTasks(null);
      let isDeleted = label.destroy();
      ctx.body = {status: 200, data: isDeleted};
    } catch (errors) {
      ctx.body = errors.ServerError(errors);
    }
  }

  async updateTaskLabel(ctx, next) {
    let task = await models.Task.findOne({
      where: {id: ctx.params.id}
    });

    let result = await task.setLabels(ctx.request.body.label_ids);

    ctx.body = {status: 200, data: result};
  }

  async updateLabel(ctx, next) {
    let label = await models.Label.findOne({
      where: {id: ctx.params.id}
    });

    label.name = ctx.request.body.name;
    label.color = ctx.request.body.color;

    let result = await label.save().then(function(res){
      return res;
    });

    ctx.body = {status: 200, data: label};
  }
};

export default TaskController;
