import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const Chat = Sequelize.define('checkins', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    question: {
      type: DataTypes.STRING,
      allowNull: false
    },

    cron: {
      type: DataTypes.STRING,
      allowNull: false
    },

    time: {
      type: DataTypes.STRING,
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

  return Chat;
}
