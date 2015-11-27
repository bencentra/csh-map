'use strict';

module.exports = {

  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Reasons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      name: Sequelize.STRING,
      description: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Reasons');
  }

};
