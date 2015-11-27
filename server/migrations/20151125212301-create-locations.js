'use strict';

module.exports = {

  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Locations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      address: Sequelize.STRING,
      latitude: Sequelize.DOUBLE,
      longitude: Sequelize.DOUBLE
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Locations');
  }

};
