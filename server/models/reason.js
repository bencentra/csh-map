'use strict';

module.exports = function(sequelize, DataTypes) {
  var Marker = sequelize.define("Reason", {
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  });  
};
