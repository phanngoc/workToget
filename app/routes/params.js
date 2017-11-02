import models from '../../models'
import _ from 'lodash'

export async function load_project(id, ctx, next) {
  ctx.state.project = await models.Project.findOne({
    where: {
      id: id
    }
  });
  if (_.isNull(ctx.state.project)) return ctx.request.status = 404;
  return await next();
}
