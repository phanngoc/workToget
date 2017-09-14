import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const Board = Sequelize.define('boards', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false
    },

    users_notify: {
      type: DataTypes.STRING,
      allowNull: true
    },

    is_pined: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    owner_id: {
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
  return Board;
}
