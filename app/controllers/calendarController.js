import models from '../../models';
import errors from '../lib/errors';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';

class CalendarController {
  constructor(...args) {
    this.args = args;
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
      console.log('updateEvent', event);
    }).then(function(res){
      return res;
    });

    let data = {
      type: 'calendar',
      deltas: event,
      typeName: 'update_event',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('UPDATE_EVENT', data);
    ctx.body = {status: 200, data: event};
  }

  async archiveEvent(ctx, next) {
    let isDestroyed = models.Event.findById(ctx.params.id)
        .tap(chat => chat.destroy());

    if (isDestroyed) {
      let data = {
        type: 'calendar',
        deltas: ctx.params.id,
        typeName: 'archive_event',
      }

      ioEmitter.to('project_' + ctx.params.project_id).emit('ARCHIVE_EVENT', data);
      ctx.body = {status: 200, data: isDestroyed};
    } else {
      ctx.body = errors.ServerError(isDestroyed);
    }
  }



};

export default CalendarController;
