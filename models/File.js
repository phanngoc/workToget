import Promise from 'bluebird';

export default function (Sequelize) {

  const File = Sequelize.define('files', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    link: {
      type: Sequelize.STRING,
      allowNull: false
    },

    project_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Project',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: false
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },

    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },

    deleted_at: {
      type: Sequelize.DATE
    }
  }, {
    paranoid: true,

    getterMethods: {

    },

    classMethods: {

    }
  });
  return File;
}
