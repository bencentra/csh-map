'use strict';

module.exports = {

  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Members', {
      uid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      cn: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Members');
  }
  
};
