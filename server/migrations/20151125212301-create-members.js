'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Members', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      uid: Sequelize.STRING,
      cn: Sequelize.STRING,
      canEmail: Sequelize.BOOLEAN,
      markerId: Sequelize.INTEGER
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Members');
  }
};
