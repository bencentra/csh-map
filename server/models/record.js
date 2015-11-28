'use strict';

module.exports = function(sequelize, DataTypes) {
  var Marker = sequelize.define("Record", {
    id: DataTypes.INTEGER,
    member: DataTypes.STRING,
    location: DataTypes.INTEGER,
    reason: DataTypes.INTEGER
  });  
};
