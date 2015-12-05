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
        Member.belongsToMany(models.Location, { through: models.Record });
      },
      seedData: function() {
        return sequelize.transaction(function(t) {
          return Promise.all([
            Member.upsert({
              uid: 'bencentra',
              cn: 'Ben Centra'
            }, { transaction: t })
          ]);
        });
      }
    }
  });
  return Member;
};
