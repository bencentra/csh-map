'use strict';

module.exports = function (sequelize, DataTypes) {
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
      // TODO: https://github.com/sequelize/sequelize/issues/3220
      // associate: function(models) {
      //   Reason.belongsToMany(models.Location, { through: models.Record, unique: false });
      // }
    }
  });
  return Reason;
};
