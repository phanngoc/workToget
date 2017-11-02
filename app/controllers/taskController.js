import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';
import activity from './helper_activity';

let slugUrl = function(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
}

class TaskController {
  constructor(...args) {
    this.args = args;
  }

  async createTask(ctx, next) {
    let updated = await models.Task.update({ order: Sequelize.literal('`order` + 1') }, { where: { frame_id: ctx.request.body.frame_id }});

    let task = await models.Task
        .create({ title: ctx.request.body.title,
          order: 0,
          frame_id: ctx.request.body.frame_id });

    task = task.toJSON();
    task.Labels = [];
    task.countComment = 0;
    let project = await models.Project.findOne({
      where: {id: ctx.params.project_id}
    });

    let dataActivity = {
      action: 'save_add_task',
      owner: ctx.state.user,
      target: {
        type: 'Task',
        data: task,
        link: {
          name: 'trello.modal',
          params: {
            project_id: ctx.params.project_id,
            task_id: task.id,
            title: slugUrl(task.title)
          }
        }
      },
      rely_on: {
        type: 'Project',
        data: project,
      }
    };
    activity(ctx.params.project_id, dataActivity);
    let data = {
      type: 'trello',
      deltas: task,
      typeName: 'save_add_task',
      frameId: task.frame_id
    }
    ioEmitter.to('project_' + ctx.params.project_id).emit('SAVE_ADD_TASK', data);
    ctx.body = {status: 200, data: task};
  }

  async updateTask(ctx, next) {
    let task = await models.Task.find({
      where: {
        id: ctx.params.id,
      }
    });

    task.title = ctx.request.body.title;
    task.description = ctx.request.body.description;

    let result = await task.save().then(function(res){
      return res;
    });

    let dataActivity = {
      action: 'save_simple_task',
      owner: ctx.state.user,
      target: {
        type: 'Task',
        data: task,
        link: {
          name: 'trello.modal',
          params: {
            project_id: ctx.params.project_id,
            task_id: task.id,
            title: slugUrl(task.title)
          }
        }
      }
    };
    activity(ctx.params.project_id, dataActivity);
    let data = {
      type: 'trello',
      deltas: task,
      typeName: 'save_simple_task',
      frameId: task.frame_id,
      projectId: ctx.request.body.project_id
    }

    ioEmitter.to('project_'+ctx.params.project_id).emit('SAVE_SIMPLE_TASK', data);
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
      },
      attributes: Object.keys(models.Task.attributes).concat([
        [
        Sequelize.literal('(SELECT COUNT("comments.id") FROM comments WHERE comments.commentable="task" AND comments.commentable_id=tasks.id)'),
        'countComment'
        ]
      ])
    });

    let comment = await task.createComment({
      content: ctx.request.body.content,
      user_id: ctx.request.body.user_id,
    });

    if (comment) {
      let user = await comment.getUser();

      comment = comment.toJSON();
      user = user.toJSON();

      comment.User = user;

      let dataActivity = {
        action: 'save_add_comment',
        owner: ctx.state.user,
        target: {
          type: 'Comment',
          data: comment,
          link: {
            name: 'trello.modal',
            params: {
              project_id: ctx.request.body.project_id,
              task_id: task.id,
              title: slugUrl(task.title)
            }
          }
        },
        rely_on: {
          type: 'Task',
          data: task
        }
      };
      activity(ctx.params.project_id, dataActivity);

      let data = {
        type: 'trello',
        deltas: comment,
        taskId: task.id,
        frameId: task.frame_id,
        countComment: task.toJSON().countComment + 1,
        typeName: 'save_add_comment',
      };

      ioEmitter.to('project_' + ctx.request.body.project_id).emit('SAVE_ADD_COMMENT', data);
    } else {
      ctx.body = errors.ServerError("Can't create comment");
    }

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
    let task = await comment.getTask();

    comment = comment.toJSON();
    user = user.toJSON();

    comment.User = user;

    let dataActivity = {
      action: 'save_edit_comment',
      owner: ctx.state.user,
      target: {
        type: 'Comment',
        data: comment,
        link: {
          name: 'trello.modal',
          params: {
            project_id: ctx.params.project_id,
            task_id: task.id,
            title: slugUrl(task.title)
          }
        }
      },
      rely_on: {
        type: 'Task',
        data: task,
      }
    };
    activity(ctx.state.user.id, dataActivity);

    let data = {
      type: 'trello',
      deltas: comment,
      typeName: 'save_edit_comment',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('SAVE_EDIT_COMMENT', data);

    ctx.body = {status: 200, data: comment};
  }

  async deleteCommentTask(ctx, next) {
    let task = await models.Task.findOne({
      where: {
        id: ctx.params.task_id
      },
    });
    let comment = await models.Comment.findOne({
      where: {id: ctx.params.id}
    }).tap((comment) => {
      comment.destroy();
    });

    let data = {
      type: 'calendar',
      deltas: comment,
      typeName: 'trello_delete_comment',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('TRELLO_DELETE_COMMENT', data);

    let dataActivity = {
      action: 'trello_delete_comment',
      owner: ctx.state.user,
      target: {
        type: 'Comment',
        data: comment,
        link: {
          name: 'trello.modal',
          params: {
            id: ctx.params.project_id,
            task_id: ctx.params.task_id,
            title: slugUrl(task.title)
          }
        }
      },
      rely_on: {
        type: 'Task',
        data: task
      }
    };
    activity(ctx.params.project_id, dataActivity);
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
      let data = {
        type: 'trello',
        deltas: ctx.request.body.due_date,
        typeName: 'save_due_date',
        taskId: ctx.params.id,
        frameId: task.frame_id,
      }

      ioEmitter.to('project_' + ctx.params.project_id).emit('SAVE_DUE_DATE', data);

      let dataActivity = {
        action: 'save_due_date',
        owner: ctx.state.user,
        target: {
          type: 'String',
          data: ctx.request.body.due_date,
          link: {
            name: 'trello.modal',
            params: {
              project_id: ctx.params.project_id,
              task_id: task.id,
              title: slugUrl(task.title)
            }
          }
        },
        rely_on: {
          type: 'Task',
          data: task
        }
      };
      activity(ctx.params.project_id, dataActivity);
      ctx.body = {status: 200, data: result};
    }
  }

  async deleteLabel(ctx, next) {
    let label = await models.Label.findOne({
      where: {id: ctx.params.id}
    });

    let labelTemp = label.toJSON();
    try {
      let isRemoveAss = label.setTasks(null);
      let isDeleted = label.destroy();
      let data = {
        type: 'trello',
        deltas: label,
        typeName: 'delete_label'
      }

      ioEmitter.to('project_' + ctx.params.project_id).emit('DELETE_LABEL', data);
      let dataActivity = {
        action: 'delete_label',
        owner: ctx.state.user,
        target: {
          type: 'Label',
          data: labelTemp,
          link: {
            name: 'trello',
            params: {
              project_id: ctx.params.project_id,
            }
          }
        },
        rely_on: {
          type: 'Project',
          data: ctx.state.project
        }
      };
      activity(ctx.params.project_id, dataActivity);
      ctx.body = {status: 200, data: isDeleted};
    } catch (e) {
      console.log('isRemoveAss Err', e);
      ctx.body = errors.ServerError(errors);
    }
  }

  async updateTaskLabel(ctx, next) {
    let task = await models.Task.findOne({
      where: {id: ctx.params.id}
    });

    let result = await task.setLabels(ctx.request.body.label_ids);
    let labels = await task.getLabels();
    let data = {
      type: 'trello',
      deltas: labels,
      taskId: task.id,
      frameId: task.frame_id,
      typeName: 'update_label_for_task'
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('UPDATE_LABEL_FOR_TASK', data);

    let dataActivity = {
      action: 'update_label_for_task',
      owner: ctx.state.user,
      target: {
        type: 'Label',
        data: labels,
        link: {
          name: 'trello.modal',
          params: {
            project_id: ctx.params.project_id,
            task_id: task.id,
            title: slugUrl(task.title)
          }
        },
        rely_on: {
          type: 'Task',
          data: task
        }
      },
    };
    activity(ctx.params.project_id, dataActivity);
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

    let data = {
      type: 'trello',
      deltas: label,
      typeName: 'update_label'
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('UPDATE_LABEL', data);

    let dataActivity = {
      action: 'update_label',
      owner: ctx.state.user,
      target: {
        type: 'Label',
        data: label,
        link: {
          name: 'trello',
          params: {
            project_id: ctx.params.project_id,
          }
        }
      },
      rely_on: {
        type: 'Project',
        data: ctx.state.project
      }
    };
    activity(ctx.params.project_id, dataActivity);

    ctx.body = {status: 200, data: label};
  }

  async createLabel(ctx, next) {
    let label = await models.Label.create({
      project_id: ctx.params.project_id,
      name: ctx.request.body.name,
      color: ctx.request.body.color
    });

    let data = {
      type: 'trello',
      deltas: label,
      typeName: 'create_label',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('CREATE_LABEL', data);

    let dataActivity = {
      action: 'create_label',
      owner: ctx.state.user,
      target: {
        type: 'Label',
        data: label,
        link: {
          name: 'trello',
          params: {
            project_id: ctx.params.project_id,
          }
        }
      },
      rely_on: {
        type: 'Project',
        data: ctx.state.project
      }
    };
    activity(ctx.params.project_id, dataActivity);

    ctx.body = {status: 200, data: label};
  }
};

export default TaskController;
