'use strict';

var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define('Member', {
    uid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    cn: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // TODO: https://github.com/sequelize/sequelize/issues/3220
        // Member.belongsToMany(models.Location, { through: models.Record, unique: false });
      }
    }
  });
  return Member;
};
