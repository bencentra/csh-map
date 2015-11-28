'use strict';

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
      }
    }
  });  
  return Reason;
};
