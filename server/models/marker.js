'use strict';

module.exports = function(sequelize, DataTypes) {
  var Marker = sequelize.define("Marker", {
    address: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        Marker.hasMany(models.User);
      }
    }
  });  
};
