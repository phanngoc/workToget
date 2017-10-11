import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const Task = Sequelize.define('tasks', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    frame_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false
    },

    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },

    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },

    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },

    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },

    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
    }
  }, {
    paranoid: true,

    getterMethods: {

    },

    classMethods: {

    }
  });
  return Task;
}
