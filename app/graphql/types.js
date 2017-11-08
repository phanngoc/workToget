import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInterfaceType
} from 'graphql';

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
      fullname: {
        type: GraphQLString,
        resolve(user) {
          return user.fullname;
        }
      },
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.username;
        }
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        }
      },
      avatar: {
        type: GraphQLString,
        resolve(user) {
          return user.avatar;
        }
      },
    }
  }
});

export const ProjectType = new GraphQLObjectType({
  name: 'Project',
  description: 'This represents a Project',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(project) {
          return project.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve(project) {
          return project.name;
        }
      },
      description: {
        type: GraphQLString,
        resolve(project) {
          return project.description;
        }
      },
      logo: {
        type: GraphQLString,
        resolve(project) {
          return project.logo;
        }
      },
      num_star: {
        type: GraphQLInt,
        resolve(project) {
          return project.num_star;
        }
      },
      user: {
        type: UserType,
        resolve(project) {
          return project.getUser();
        }
      },
    }
  }
});
