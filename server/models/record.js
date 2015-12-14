'use strict';

var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var Record = sequelize.define('Record', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        Record.belongsTo(models.Member);
        Record.belongsTo(models.Location);
        Record.belongsTo(models.Reason);
      },
      getHistory: function(limit, offset) {
        var options = {
          order: 'id DESC',
          include: [{ all: true }]
        };
        if (typeof limit === 'number' && limit > 0) {
          options.limit = limit;
          if (typeof offset === 'number' && offset > 0) {
            options.offset = offset;
          }
        }
        return Record.findAll(options);
      },
      getPresent: function() {
        return sequelize.query(
          'SELECT r.id, r.MemberUid, r.LocationId, r.ReasonId, r.createdAt, r.updatedAt, m.updatedAt FROM Records r, Members m WHERE r.updatedAt = m.updatedAt GROUP BY r.MemberUid',
          { model: Record }
        );
      },
      addRecord: function(memberUid, locationId, reasonId) {
        return Record.create({
          MemberUid: memberUid,
          LocationId: locationId || null,
          ReasonId: reasonId || 1
        });
      }
    }
  });  
  return Record;
};
