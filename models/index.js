/**
 * Dependencies.
 */
import Sequelize from 'sequelize';
import { database as config } from 'config';

/**
 * Database connection.
 */

// If we launch the process with DEBUG=psql, we log the postgres queries
if (process.env.DEBUG) {
  config.options.logging = true;
}

if (config.options.logging) {
  if (process.env.NODE_ENV === 'production') {
    config.options.logging = (query, executionTime) => {
      console.log(query.slice(0, 100), '|', executionTime, 'ms');
    }
  } else {
    config.options.logging = (query, executionTime) => {
      console.log(`\n-------------------- <query> --------------------\n`,query,`\n-------------------- </query executionTime="${executionTime}"> --------------------\n`);
    }
  }
}

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.options
);

console.log("Application start");

const models = setupModels(sequelize);
export default models;

/**
 * Separate function to be able to use in scripts
 */
export function setupModels(client) {
  const m = {}; // models

  /**
   * Models.
   */

  [
    'Task',
    'File',
    'Project',
    'Chat',
    'User',
    'Board',
    'TaskUser',
    'TaskLabel',
    'Label',
    'ProjectUser',
    'Comment',
    'Activity',
    'Notification'
  ].forEach((model) => {
    m[model] = client.import(`${__dirname}/${model}`);
  });

  /**
   * Relationships
   */
    m.Project.hasMany(m.Chat, {as: 'Chats'});

    m.User.hasMany(m.Chat, {as: 'Chats'});

    m.User.belongsToMany(m.Project, { as: 'Projects', through:{model: m.ProjectUser, unique:false}});

    m.Project.belongsToMany(m.User, { as: 'Users', through: m.ProjectUser});

    m.Task.belongsToMany(m.Label, { as: 'Labels', through:{model: m.TaskLabel, unique:false}});

    m.Label.belongsToMany(m.Task, { as: 'Tasks', through: m.TaskLabel});

    m.Board.hasMany(m.Comment, {
        foreignKey: 'commentable_id',
        constraints: false,
        scope: {
            commentable: 'board'
        }
    });

    m.Comment.belongsTo(m.Board, {
        foreignKey: 'commentable_id',
        constraints: false,
        as: 'board'
    });

    m.Task.hasMany(m.Comment, {
        foreignKey: 'commentable_id',
        constraints: false,
        scope: {
            commentable: 'task'
        }
     });

    m.Comment.belongsTo(m.Task, {
        foreignKey: 'commentable_id',
        constraints: false,
        as: 'task'
    });

  return m;
}
