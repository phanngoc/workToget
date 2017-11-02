import models from '../../models';
import errors from '../lib/errors';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';
import activity from './helper_activity';

class CalendarController {
  constructor(...args) {
    this.args = args;
  }

  async createComment(ctx, next) {
    let event = await models.Event.findOne({
      where: {
        id: ctx.params.event_id
      },
      includes: [
        {
          model: models.User,
          as: 'User',
        }
      ]
    });

    let comment = await event.createComment({
      content: ctx.request.body.content,
      user_id: ctx.state.user.id,
    }).then((commentT) => {
      commentT = commentT.toJSON();
      commentT.User = ctx.state.user;
      return commentT;
    });

    let data = {
      type: 'calendar',
      deltas: comment,
      typeName: 'event_add_comment',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('EVENT_ADD_COMMENT', data);

    let dataActivity = {
      action: 'event_add_comment',
      owner: ctx.state.user,
      target: {
        type: 'Comment',
        data: comment,
        link: {
          name: 'calendar.show_event',
          params: {
            id: ctx.params.project_id,
            event_id: ctx.params.event_id,
          }
        }
      },
      rely_on: {
        type: 'Event',
        data: event
      }
    };
    activity(ctx.params.project_id, dataActivity);
    ctx.body = {status: 200, data: comment};
  }

  async updateComment(ctx, next) {
    let event = await models.Event.findOne({
      where: {
        id: ctx.params.event_id
      },
    });
    let comment = await models.Comment.findOne({
      where: {id: ctx.params.id},
      include: [
        {
          model: models.User,
          as: 'User'
        }
      ]
    });
    comment.content = ctx.request.body.content;
    let isUpdated = await comment.save().then(function(res){
      return res;
    });

    let data = {
      type: 'calendar',
      deltas: comment,
      typeName: 'event_update_comment',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('EVENT_UPDATE_COMMENT', data);

    let dataActivity = {
      action: 'event_update_comment',
      owner: ctx.state.user,
      target: {
        type: 'Comment',
        data: comment,
        link: {
          name: 'calendar.show_event',
          params: {
            id: ctx.params.project_id,
            event_id: ctx.params.event_id,
          }
        }
      },
      rely_on: {
        type: 'Event',
        data: event
      }
    };
    activity(ctx.params.project_id, dataActivity);
    ctx.body = {status: 200, data: comment};
  }

  async deleteComment(ctx, next) {
    let event = await models.Event.findOne({
      where: {
        id: ctx.params.event_id
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
      typeName: 'event_delete_comment',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('EVENT_DELETE_COMMENT', data);

    let dataActivity = {
      action: 'event_delete_comment',
      owner: ctx.state.user,
      target: {
        type: 'Comment',
        data: comment,
        link: {
          name: 'calendar.show_event',
          params: {
            id: ctx.params.project_id,
            event_id: ctx.params.event_id,
          }
        }
      },
      rely_on: {
        type: 'Event',
        data: event
      }
    };
    activity(ctx.params.project_id, dataActivity);
    ctx.body = {status: 200, data: comment};
  }

  async showEvent(ctx, next) {
    let events = await models.Event.findOne({
      where: {id: ctx.params.id},
      include: [{
        model: models.User,
        as: 'User',
        required: true
      }, {
        model: models.Comment,
        as: 'Comment',
        required: false,
        include: [
          {
            model: models.User,
            as: 'User',
            required: true
          }
        ]
      }]
    });

    ctx.body = {status: 200, data: events};
  }
  async loadEvents(ctx, next) {
    let objWhere = {project_id: ctx.params.project_id};

    let events = await models.Event.findAll({
      where: objWhere,
      include: [{
          model: models.User,
          as: 'User',
          required: true
      }]
    });

    ctx.body = {status: 200, data: events};
  }

  async loadUserBelongProject(ctx, next) {
    let argsWhere = {project_id: ctx.params.project_id};

    let users = await models.ProjectUser.findAll({
      where: argsWhere,
      include: [{
          model: models.User,
          as: 'User',
          required: true
      }]
    });

    ctx.body = {status: 200, data: users};
  }

  async createEvent(ctx, next) {
    let event = await models.Event.create({
      title: ctx.request.body.title,
      note: ctx.request.body.note,
      project_id: ctx.params.project_id,
      user_id: ctx.state.user.id,
      is_allday: ctx.request.body.is_allday,
      start: ctx.request.body.start,
      end: ctx.request.body.end,
      with_user: JSON.stringify(ctx.request.body.with)
    });

    event = event.toJSON();
    event.User = ctx.state.user;

    let data = {
      type: 'calendar',
      deltas: event,
      typeName: 'add_event',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('ADD_EVENT', data);

    let dataActivity = {
      action: 'add_event',
      owner: ctx.state.user,
      target: {
        type: 'Event',
        data: event,
        link: {
          name: 'calendar.show_event',
          params: {
            id: ctx.params.project_id,
            event_id: event.id,
          }
        }
      },
      rely_on: {
        type: 'Project',
        data: ctx.state.project
      }
    };
    activity(ctx.params.project_id, dataActivity);
    ctx.body = {status: 200, data: event};
  }

  async updateEvent(ctx, next) {
    let event = await models.Event.find({
      where: {
        id: ctx.params.id,
      }
    });

    event.title = ctx.request.body.title;
    event.note = ctx.request.body.note;
    event.start = ctx.request.body.start;
    event.end = ctx.request.body.end;
    event.is_allday = ctx.request.body.is_allday;
    event.with_user = JSON.stringify(ctx.request.body.with);

    let result = await event.save().tap(function(event) {
    }).then(function(res){
      return res;
    });

    let data = {
      type: 'calendar',
      deltas: event,
      typeName: 'update_event',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('UPDATE_EVENT', data);

    let dataActivity = {
      action: 'update_event',
      owner: ctx.state.user,
      target: {
        type: 'Event',
        data: event,
        link: {
          name: 'calendar.show_event',
          params: {
            id: ctx.params.project_id,
            event_id: event.id,
          }
        }
      },
      rely_on: {
        type: 'Project',
        data: ctx.state.project
      }
    };
    activity(ctx.params.project_id, dataActivity);
    ctx.body = {status: 200, data: event};
  }

  async archiveEvent(ctx, next) {
    let event = models.Event.findById(ctx.params.id)
        .tap(event => event.destroy())
        .then(function(event) {
          return event;
        });

    if (isDestroyed) {
      let data = {
        type: 'calendar',
        deltas: ctx.params.id,
        typeName: 'archive_event',
      }

      ioEmitter.to('project_' + ctx.params.project_id).emit('ARCHIVE_EVENT', data);
      let dataActivity = {
        action: 'archive_event',
        owner: ctx.state.user,
        target: {
          type: 'Event',
          data: event,
          link: {
            name: 'calendar',
            params: {
              id: ctx.params.project_id,
            }
          }
        },
        rely_on: {
          type: 'Project',
          data: ctx.state.project
        }
      };
      activity(ctx.params.project_id, dataActivity);
      ctx.body = {status: 200, data: isDestroyed};
    } else {
      ctx.body = errors.ServerError(isDestroyed);
    }
  }



};

export default CalendarController;
