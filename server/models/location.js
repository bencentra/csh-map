'use strict';

module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    address: DataTypes.STRING,
    latitude: {
      type: DataTypes.DOUBLE,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: DataTypes.DOUBLE,
      validate: { min: -180, max: 180 }
    }
  }, {
    classMethods: {
      // TODO: https://github.com/sequelize/sequelize/issues/3220
      // associate: function(models) {
      //   Location.belongsToMany(models.Member, { through: models.Record, unique: false });
      // },
      addLocation: function(address, latitude, longitude) {
        return Location.findOrCreate({
          where: {
            address: address
          },
          defaults: {
            latitude: latitude, 
            longitude: longitude
          }
        });
      }
    }
  }); 
  return Location;
};
