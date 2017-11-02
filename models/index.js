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
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    "host": process.env.HOST,
    "dialect": process.env.DIALECT
  }
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
    'Label',
    'ProjectUser',
    'Comment',
    'Activity',
    'Notification',
    'Frame',
    'Event',
  ].forEach((model) => {
    m[model] = client.import(`${__dirname}/${model}`);
  });

  /**
   * Relationships
   */
    m.Project.hasMany(m.Frame, {as: 'Frames', foreignKey: 'project_id'});
    m.Project.hasMany(m.Chat, {as: 'Chats', foreignKey: 'project_id'});
    m.Project.belongsToMany(m.User, { as: 'Users', through: m.ProjectUser, foreignKey: 'project_id'});

    m.User.hasMany(m.Chat, {as: 'Chats', foreignKey: 'user_id'});
    m.User.belongsToMany(m.Project, { as: 'Projects', through: {model: m.ProjectUser, unique:false}, foreignKey: 'user_id'});

    m.Frame.hasMany(m.Task, {as: 'Tasks', foreignKey: 'frame_id'});

    m.Task.belongsToMany(m.Label, { as: 'Labels', through:{model: m.TaskLabel, unique:false}, foreignKey: 'task_id'});
    m.Task.hasMany(m.Comment, {
        foreignKey: 'commentable_id',
        constraints: false,
        scope: {
            commentable: 'task'
        }
     });
    m.Task.belongsTo(m.Frame, {
        foreignKey: 'frame_id',
        constraints: false,
        as: 'Frame'
    });

    m.Label.belongsToMany(m.Task, { as: 'Tasks', through: m.TaskLabel, foreignKey: 'label_id'});
    m.Label.belongsTo(m.Project, {as: 'Project', foreignKey: 'project_id', constraints: true});

    m.Board.hasMany(m.Comment, {
        foreignKey: 'commentable_id',
        constraints: false,
        scope: {
            commentable: 'board'
        }
    });

    m.Chat.belongsTo(m.User, {as: 'User', foreignKey: 'user_id'});
    m.Chat.belongsTo(m.Project, {as: 'Project', foreignKey: 'project_id'});

    m.Event.belongsTo(m.User, {as: 'User', foreignKey: 'user_id'});
    m.Event.belongsTo(m.Project, {as: 'Project', foreignKey: 'project_id'});
    m.Event.hasMany(m.Comment, {
        foreignKey: 'commentable_id',
        constraints: false,
        scope: {
            commentable: 'event'
        },
        as: 'Comment'
     });

    m.Comment.belongsTo(m.Board, {
        foreignKey: 'commentable_id',
        constraints: false,
        as: 'board'
    });
    m.Comment.belongsTo(m.Task, {
        foreignKey: 'commentable_id',
        constraints: false,
        as: 'task'
    });
    m.Comment.belongsTo(m.Event, {
        foreignKey: 'commentable_id',
        constraints: false,
        as: 'event'
    });
    m.Comment.belongsTo(m.User, {
        foreignKey: 'user_id',
        constraints: true,
        as: 'User'
    });

    m.ProjectUser.belongsTo(m.User, {as: 'User', foreignKey: 'user_id'});

  return m;
}
