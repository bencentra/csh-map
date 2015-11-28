'use strict';

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
        Location.hasMany(models.Record);
      }
    }
  }); 
  return Location;
};
