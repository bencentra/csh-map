'use strict';

module.exports = function(sequelize, DataTypes) {
  var Marker = sequelize.define("Move", {
    id: DataTypes.INTEGER,
    member: DataTypes.STRING,
    location: DataTypes.INTEGER,
    reason: DataTypes.INTEGER
  });  
};
