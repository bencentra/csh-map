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

    // },
    // member: {
    //   type: DataTypes.STRING
    //   // references: {
    //   //   model: sequelize.models.Member,
    //   //   key: 'uid'
    //   // }
    // },
    // location: {
    //   type: DataTypes.INTEGER
    //   // references: {
    //   //   model: sequelize.models.Location,
    //   //   key: 'id'
    //   // }
    // },
    // reason: {
    //   type: DataTypes.INTEGER
    //   // references: {
    //   //   model: sequelize.models.Reason,
    //   //   key: 'id'
    //   // }
