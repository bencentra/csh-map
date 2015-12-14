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
      },
      addMember: function(uid, cn) {
        return Member.findOrCreate({
          where: {
            uid: uid
          }, 
          defaults: {
            cn: cn
          }
        });
      },
      setName: function(uid, cn) {
        return Member.update({ cn: cn }, {
          where: {
            uid: uid
          }
        });
      },
      setUpdatedAt: function(uid, date) {
        return Member.update({ updatedAt: date }, {
          where: {
            uid: uid
          }
        });
      }
    }
  });
  return Member;
};
