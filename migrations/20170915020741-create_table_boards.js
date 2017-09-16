'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('boards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      content: {
        type: Sequelize.STRING,
        allowNull: false
      },

      users_notify: {
        type: Sequelize.STRING,
        allowNull: true
      },

      is_pined: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
      },

      owner_id: {
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
    return queryInterface.dropTable('boards');
  }
};
