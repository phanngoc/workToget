'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('chats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      content: {
        type: Sequelize.STRING,
        allowNull: false
      },

      type: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false
      },

      project_id: {
        type: Sequelize.INTEGER,
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
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('chats');
  }
};
