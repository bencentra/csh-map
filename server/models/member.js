'use strict';

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define("Member", {
    uid: DataTypes.STRING,
    cn: DataTypes.STRING,
    canEmail: DataTypes.BOOLEAN,
    markerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Marker, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
};
