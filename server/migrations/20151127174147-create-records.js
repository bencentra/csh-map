'use strict';

module.exports = {

  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Records', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      member: Sequelize.STRING,
      location: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      reason: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Records');
  }

};
