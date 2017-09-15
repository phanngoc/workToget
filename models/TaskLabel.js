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
  return TaskLabel;
}
