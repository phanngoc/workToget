import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const Answer = Sequelize.define('answers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    date_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },

    question_id: {
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

  return Answer;
}
