'use strict';

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define("Member", {
    uid: DataTypes.STRING,
    cn: DataTypes.STRING
  });
};
