'use strict';

var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    address: DataTypes.STRING,
    latitude: {
      type: DataTypes.DOUBLE,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: DataTypes.DOUBLE,
      validate: { min: -180, max: 180 }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Location.belongsToMany(models.Member, { through: models.Record });
      },
      seedData: function() {
        return sequelize.transaction(function(t) {
          return Promise.all([
            Location.upsert({
              id: 1,
              address: 'Boston, MA, USA',
              latitude: 42.3601,
              longitude: 71.0589
            }, { transaction: t })
          ]);
        });
      }
    }
  }); 
  return Location;
};
