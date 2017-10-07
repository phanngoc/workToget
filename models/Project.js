import Promise from 'bluebird';

export default function (Sequelize, DataTypes) {

  const Project = Sequelize.define('projects', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false
    },

    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    num_star: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    is_pinned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    owner_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: false,
      defaultValue: 0
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
  return Project;
}
