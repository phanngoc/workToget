import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const Comment = Sequelize.define('comments', {
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
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },

    commentable: {
        type: DataTypes.STRING,
        allowNull: false
    },

    commentable_id: {
        type: DataTypes.INTEGER,
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
  return Comment;
}
