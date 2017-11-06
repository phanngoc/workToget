import models from '../../models';
import errors from '../lib/errors';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';
import fs from 'fs';
import path from 'path';
import {list_notify, check_list_notify, visit_notify} from '../repo/repo_notification';
import moment from 'moment';

class UserController {
  constructor(...args) {
    this.args = args;
  }

  async loadUsers(ctx, next) {
    let users = await models.User.findAll({
    });
    ctx.body = {status: 200, data: users};
  }

  async loadNotification(ctx, next) {
    let time = moment().unix();
    let offset = !_.isUndefined(ctx.request.query.offset) ? ctx.request.query.offset : 0;
    let results = await list_notify(ctx.state.user.id, offset, 4);
    ctx.body = {status: 200, data: results};
  }

  async checkNotification(ctx, next) {
    let time = moment().unix();
    let data = ctx.request.body.data;
    // data must be array 2 item.
    let results = await check_list_notify(ctx.state.user.id, data);
    ctx.body = {status: 200, data: results};
  }

  async visitNotification(ctx, next) {
    let time = moment().unix();
    let data = ctx.request.body.data;
    let results = await visit_notify(ctx.state.user.id, data);
    ctx.body = {status: 200, data: results};
  }
};

export default UserController;
