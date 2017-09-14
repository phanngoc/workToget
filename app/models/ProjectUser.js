import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const ProjectUser = Sequelize.define('project_users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM(['guest','member','admin']),
      allowNull: false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },

    deleted_at: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,

    getterMethods: {

    },

    classMethods: {

    }
  });
  return ProjectUser;
}
