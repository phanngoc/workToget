import models from '../../models';
import errors from '../lib/errors';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';
import fs from 'fs';
import path from 'path';

class UserController {
  constructor(...args) {
    this.args = args;
  }

  async loadUsers(ctx, next) {
    let users = await models.User.findAll({
    });

    ctx.body = {status: 200, data: users};
  }
};

export default UserController;
