import models from '../../models';
import errors from '../lib/errors';
import debug from 'debug';
import Sequelize from 'sequelize';
import async from 'async';
import _ from 'lodash';
import {ioEmitter} from '../../io.js';
import activity from '../repo/repo_activity';
import {NEW, notification} from '../repo/repo_notification';
import * as repo_checkin from '../repo/repo_checkin';
import * as repo_answer from '../repo/repo_answer';

class CheckinController {
  constructor(...args) {
    this.args = args;
  }

  async create(ctx, next) {
    let checkin = await repo_checkin.create(ctx.request.body, ctx.params.project_id);

    let dataActivity = {
      action: 'create_question',
      owner: ctx.state.user,
      target: {
        type: 'Checkin',
        data: checkin,
        link: {
          name: 'checkin.show_question',
          params: {
            id: ctx.params.project_id,
            question_id: checkin.id,
          }
        }
      },
      rely_on: {
        type: 'Project',
        data: ctx.state.project
      }
    };
    activity(ctx.params.project_id, dataActivity);
    ctx.body = {status: 200, data: checkin};
  }

  async update(ctx, next) {
    let checkin = await repo_checkin.update(ctx.request.body);

    let dataActivity = {
      action: 'update_question',
      owner: ctx.state.user,
      target: {
        type: 'Comment',
        data: comment,
        link: {
          name: 'checkin.show_question',
          params: {
            id: ctx.params.project_id,
            question_id: checkin.id,
          }
        }
      },
      rely_on: {
        type: 'Project',
        data: ctx.state.project
      }
    };
    activity(ctx.params.project_id, dataActivity);
    ctx.body = {status: 200, data: comment};
  }

  async archive(ctx, next) {
    let checkin = await models.Checkin.findOne({
      where: {id: ctx.params.id}
    }).tap((checkin) => {
      checkin.destroy();
      models.Answer.where({question_id: checkin.id}).destroy();
    });

    let dataActivity = {
      action: 'archive_question',
      owner: ctx.state.user,
      target: {
        type: 'Checkin',
        data: checkin,
        link: {
          name: 'checkin.list_question',
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

    ctx.body = {status: 200, data: checkin};
  }

  async show(ctx, next) {
    let checkin = await repo_checkin.findOne(ctx.params.id);
    ctx.body = {status: 200, data: checkin};
  }

  async load(ctx, next) {
    let checkins = await repo_checkin.load(ctx.params.project_id);
    ctx.body = {status: 200, data: checkins};
  }

  async loadAnwers(ctx, next) {
    
    console.log('loadAnswers', days);
    ctx.body = {status: 200, data: days};
  }

  async createAnswer(ctx, next) {
    let checkin = await repo_answer.create(ctx.request.body, ctx.params.project_id, ctx.params.question_id);
    ctx.body = {status: 200, data: checkin};
  }

  async updateAnswer(ctx, next) {
    let checkin = await repo_answer.create(ctx.request.body, ctx.params.project_id, ctx.params.question_id);
  }
};

export default CheckinController;
