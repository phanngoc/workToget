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
import * as repo_ans_com from '../repo/repo_ans_com';

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
    ctx.body = {status: 200, data: checkin};
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
    let results = await repo_answer.loadMore(ctx.params.question_id, ctx.query.page);
    ctx.body = {status: 200, data: results};
  }

  async createAnswer(ctx, next) {
    let answer = await repo_answer.create(ctx.request.body, ctx.params.question_id, ctx.state.user);
    ctx.body = {status: 200, data: answer};
  }

  async updateAnswer(ctx, next) {
    let result = await repo_answer.update(ctx.request.body);
    ctx.body = {status: 200, data: result};
  }

  async editAnswer(ctx, next) {
    let answer = await repo_answer.findOne(ctx.params.answer_id);
    ctx.body = {status: 200, data: answer};
  }

  async loadMoreComment(ctx, next) {
    let comments = await repo_ans_com.loadMore(ctx.params.answer_id, ctx.query.page);
    ctx.body = {status: 200, data: comments};
  }

  async createComment(ctx, next) {
    let comment = await repo_ans_com.create(ctx.request.body, ctx.params.answer_id, ctx.state.user);
    ctx.body = {status: 200, data: comment};
  }

  async updateComment(ctx, next) {
    let comment = await repo_ans_com.update(ctx.request.body);
    ctx.body = {status: 200, data: comment};
  }

  async deleteComment(ctx, next) {
    let comment = await repo_ans_com.destroy(ctx.params.comment_id);
    ctx.body = {status: 200, data: comment};
  }

  async authCalendar(ctx, next) {
    let authUrl = await repo_answer.authorize();
    ctx.redirect(authUrl);
  }

  async receiveToken(ctx, next) {
    repo_answer.getNewToken(ctx);
  }

  async getListCalendar(ctx, next) {
    let oauth = await repo_answer.authorize();
    await repo_answer.insertEvent(oauth);
    
  }
};

export default CheckinController;
