import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const TaskLabel = Sequelize.define('task_labels', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    label_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
  return TaskLabel;
}
