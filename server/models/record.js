'use strict';

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
          order: 'id DESC'
          // include: [{ all: true }]
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
        // http://ask.metafilter.com/51482/How-do-I-get-the-record-with-the-most-current-date-by-a-key-field
        return sequelize.query(
          'SELECT * from Records a WHERE createdAt = (SELECT MAX(createdAt) from Records b WHERE a.MemberUid = b.MemberUid) AND LocationId IS NOT NULL',
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
