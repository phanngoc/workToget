import models from '../../models';
import errors from '../lib/errors';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';

class ChatController {
  constructor(...args) {
    this.args = args;
  }

  async loadMessages(ctx, next) {
    let messages = await models.Chat.findAll({
      where: {
        project_id: ctx.params.project_id
      },
      order: [
        ['createdAt', 'ASC'],
      ],
      include: [{
          model: models.User,
          as: 'User',
          required: true
      }]
    });

    ctx.body = {status: 200, data: messages};
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
