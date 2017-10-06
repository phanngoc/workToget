import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const Frame = Sequelize.define('frames', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },

    project_id: {
      type: DataTypes.INTEGER,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
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
  return Frame;
}
