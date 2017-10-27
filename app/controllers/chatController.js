import models from '../../models';
import errors from '../lib/errors';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';
import fs from 'fs';
import path from 'path';

class ChatController {
  constructor(...args) {
    this.args = args;
  }

  async loadMessages(ctx, next) {
    let lastTime = ctx.query.createdAt;

    let objWhere = {project_id: ctx.params.project_id};
    if (!_.isUndefined(lastTime)) {
      objWhere['createdAt'] = {
        $lt: lastTime
      };
    }
    let messages = await models.Chat.findAll({
      where: objWhere,
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: 8,
      include: [{
          model: models.User,
          as: 'User',
          required: true
      }]
    });

    ctx.body = {status: 200, data: messages};
  }

  async deleteMessage(ctx, next) {
    let isDestroyed = models.Chat.findById(ctx.params.id)
      .tap((chat) => {
        if (chat.type == 1) {
          let content = JSON.parse(chat.content);
          fs.unlink(path.resolve('./resources/public' + content.link), function(err) {
            console.log(err);
          });
        }
      }).tap(chat => chat.destroy());

    if (isDestroyed) {
      let data = {
        type: 'chat',
        deltas: ctx.params.id,
        typeName: 'delete_message',
      }

      ioEmitter.to('project_' + ctx.params.project_id).emit('DELETE_MESSAGE', data);
      ctx.body = {status: 200, data: isDestroyed};
    } else {
      ctx.body = errors.ServerError(isDestroyed);
    }
  }

  async createMessage(ctx, next) {
    let message = await models.Chat.create({
      content: ctx.request.body.content,
      type: ctx.request.body.type,
      project_id: ctx.params.project_id,
      user_id: ctx.state.user.id
    });
    message = message.toJSON();
    message.User = ctx.state.user;

    let data = {
      type: 'chat',
      deltas: message,
      typeName: 'ADD_MESSAGE',
    }

    ioEmitter.to('project_' + ctx.params.project_id).emit('ADD_MESSAGE', data);
    ctx.body = {status: 200, data: message};
  }
};

export default ChatController;
