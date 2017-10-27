import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

    const Event = Sequelize.define('events', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    note: {
      type: DataTypes.STRING,
      allowNull: true
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

    project_id: {
      field: 'project_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'Project',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: false
    },

    is_allday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    with_user: {
        type: DataTypes.STRING,
        allowNull: false
    },

    start: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },

    end: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
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
  return Event;
}
