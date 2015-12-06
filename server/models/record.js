'use strict';

var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var Record = sequelize.define('Record', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        Record.belongsTo(models.Member);
        Record.belongsTo(models.Location);
        // Record.belongsTo(models.Reason);
      }
    }
  });  
  return Record;
};
