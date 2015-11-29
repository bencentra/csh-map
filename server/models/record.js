'use strict';

module.exports = function(sequelize, DataTypes) {
  var Record = sequelize.define('Record', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });  
  return Record;
};
