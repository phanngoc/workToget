import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLScalarType,
  GraphQLError
} from 'graphql';

export const ProjectInputType = new GraphQLInputObjectType({
  name: 'ProjectInputType',
  description: 'Project type',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString)},
    description: { type: new GraphQLNonNull(GraphQLString)},
    logo: { type: new GraphQLNonNull(GraphQLString)},
    num_star: { type: new GraphQLNonNull(GraphQLInt)},
    owner_id: { type: new GraphQLNonNull(GraphQLInt)},
    users_id: { type: new GraphQLList(GraphQLString)},
  })
});
