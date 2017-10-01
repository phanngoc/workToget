import models from '../../models';
import errors from '../lib/errors';
import passport from 'koa-passport';
import debug from 'debug';

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

  async update(ctx, next) {
    let project = models.Project.findOne({
      id: ctx.params.id
    });
    project.name = ctx.params.name;
    project.description = ctx.params.description;
    project.save().success(function() {

    });
    ctx.body = {status: 200, projects: projects};
  }

};

export default ProjectController;
