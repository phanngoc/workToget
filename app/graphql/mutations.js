import models from '../../models';
import async from 'async';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import {ProjectType} from './types';
import {ProjectInputType} from './inputTypes';

const mutations = {
  createProject: {
    type: ProjectType,
    args: {
      project: { type: new GraphQLNonNull(ProjectInputType) }
    },
    resolve(_, args) {
      const projectData = {
        ...args.project,
      };
      return new Promise((resolve, reject) => {
        async.auto({
          create_project: function(callback) {
            models.Project.create(projectData)
            .then(g => {
              callback(null, g);
              return g;
            });
          },
          find_user_id: ['create_project', function(projectSaved, callback) {
            async.map(projectData.users_id,
              function(value, callback1) {
                models.User.findAll({
                  where: {
                    [Op.or]: [{username: value}, {email: value}],  // (a = 5 OR a = 6)
                  }
                }).then((users) => {
                  callback1(null, users[0].id);
                })
              }, function(err, results) {
                results.push(projectSaved.owner_id);
                callback(null, results);
            });
          }],
          link_project_user: ['create_project', 'find_user_id', function(results, callback) {
            async.map(results.find_user_id,
              function(value, callback1) {
                let role = (value == results.create_project.owner_id) ? 'admin':'guest';
                models.ProjectUser.create({
                  user_id: value,
                  project_id: results.create_project.id,
                  role: role
                }).then((projectUser) => {
                  callback1(null, projectUser);
                })
              }, function(err, results) {
                callback(null, results);
            });
          }],
        }, function(err, results) {
            console.log('err = ', err);
            console.log('results = ', results);
            if (err) {
              reject(err);
            } else {
              resolve(results.create_project);
            }
        });
      });
    }
  },
}

export default mutations;
