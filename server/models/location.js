'use strict';

module.exports = function(sequelize, DataTypes) {
  var Marker = sequelize.define("Location", {
    id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  });  
};
