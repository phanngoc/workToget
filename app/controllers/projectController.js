import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';
import Sequelize from 'sequelize';

class ProjectController {
  constructor(...args) {
    this.args = args;
  }

  async index(ctx, next) {
    return ctx.render('projects.pug', {
      title: 'This is basecamp me!',
      baseUrl: process.env.BASE_URL
    });
  }

  async getProjects(ctx, next) {
    let projects = await models.Project.findAll({
      where: {
        owner_id: ctx.params.id,
      }
    });
    ctx.body = {status: 200, projects: projects};
  }

  async trello(ctx, next) {
    return ctx.render('trello.pug', {
      title: 'This is basecamp me!',
      baseUrl: process.env.BASE_URL
    });
  }

  async getFrames(ctx, next) {
    let frames = await models.Frame.findAll({
      where: {
        project_id: ctx.params.id,
      },
      include: [{
          model: models.Task,
          as: 'Tasks',
          include: [
              {
                  model: models.Label,
                  as: 'Labels',
                  duplicating: true,
                  required: false,
              }
          ]
      }]
    });
    ctx.body = {status: 200, frames: frames};
  }

  async update(ctx, next) {
    let project = await models.Project.findOne({
      id: ctx.params.id
    });

    project.name = ctx.request.body.name;
    project.description = ctx.request.body.description;
    let result = await project.save().then(function(res){
      return res;
    }) ;
    ctx.body = {status: 200, result: result};
  }

  async updatePin(ctx, next) {
    let project = await models.Project.findOne({
      id: ctx.params.id
    });

    project.is_pinned = ctx.request.body.is_pinned;

    let result = await project.save().then(function(res){
      return res;
    }) ;
    ctx.body = {status: 200, result: result};
  }

  async show(ctx, next) {
    return ctx.render('show.pug', {
      title: 'This is basecamp me!',
      baseUrl: process.env.BASE_URL
    });
  }
};

export default ProjectController;
