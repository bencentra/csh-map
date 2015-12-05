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
      },
      seedData: function() {
        return sequelize.transaction(function(t) {
          return Promise.all([
            Record.upsert({
              id: 1,
              MemberUid: 1,
              LocationId: 1
              // ReasonId: 1
            }, { transaction: t })
          ]);
        });
      }
    }
  });  
  return Record;
};
