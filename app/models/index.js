/**
 * Dependencies.
 */
import Sequelize from 'sequelize';
import { database as config } from 'config';

// this is needed to prevent sequelize from converting integers to strings, when model definition isn't clear
// like in case of the key totalDonations and raw query (like User.getTopBackers())
pg.defaults.parseInt8 = true;

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

    m.User.belongsToMany(m.Project, { as: 'Projects', through: 'ProjectUser' });

    m.Project.belongsToMany(m.User, { as: 'Users', through: 'ProjectUser' });

    m.Task.belongsToMany(m.Label, { as: 'Labels', through: 'TaskLabel' });

    m.Label.belongsToMany(m.Task, { as: 'Tasks', through: 'TaskLabel' });

    m.Board.hasMany(m.Comment, {
        foreignKey: 'commentable_id',
        constraints: false,
        scope: {
            commentable: 'board'
        }
    });

    m.Comment.belongsTo(this.Post, {
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

    m.Comment.belongsTo(this.Post, {
        foreignKey: 'commentable_id',
        constraints: false,
        as: 'task'
    });

  return m;
}
