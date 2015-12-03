'use strict';

var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var Reason = sequelize.define('Reason', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Reason.hasMany(models.Record);
      },
      seedData: function() {
        return sequelize.transaction(function(t) {
          return Promise.all([
            Reason.upsert({ 
              id: 1,
              name: 'Internship/Co-op',
              description: 'Moved for an internship or co-op while at RIT'
            }, { transaction: t }),
            Reason.upsert({
              id: 2,
              name: 'Full-time job',
              description: 'Moved after acquiring a full-time job'
            }, { transaction: t }),
            Reason.upsert({
              id: 3,
              name: 'Family',
              description: 'Moved for family reasons'
            }, { transaction: t })
          ]);
        });
      }
    }
  });  
  return Reason;
};
