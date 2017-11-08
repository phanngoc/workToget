import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql';

import models from '../../models';

import {
  ProjectType
} from './types';

const queries = {
  allProjects: {
    type: new GraphQLList(ProjectType),
    args: {
      owner_id: {
        type: new GraphQLNonNull(GraphQLInt)
      }
    },
    resolve(_, args) {
      return models.Project.findAll({
        where: {owner_id: args.owner_id}
      })
    }
  },
  projectsHomePage: {
    type: new GraphQLList(ProjectType),
    args: {
      offset: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      limit: {
        type: new GraphQLNonNull(GraphQLInt)
      }
    },
    resolve(_, args) {
      return models.Project.findAll({
        offset: args.offset,
        limit: args.limit,
      })
    }
  },
};

export default queries;
