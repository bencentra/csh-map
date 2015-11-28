'use strict';

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
        Member.hasMany(models.Record);
      }
    }
  });
  return Member;
};
