import Backbone from 'backbone';
import _ from 'underscore';
import Q from 'q';
import LocationCollection from '../collections/locations';
import MemberCollection from '../collections/members';
import RecordCollection from '../collections/records';

let start = null;
let end = null;

class MapModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.set('config', attributes.config);
    this.set('locations', new LocationCollection());
    this.set('members', new MemberCollection());
    this.set('records', new RecordCollection());
    this.set('markers', {});
  }

  init() {
    start = Date.now();
    return Q.all([
      this.get('locations').init(),
      this.get('members').init(),
      this.get('records').init()
    ]).then(this._ready.bind(this))
      .catch(this._initError.bind(this));
  }

  _initError(error) {
    console.error(error);
  }

  _ready() {
    this._createMarkers();
    end = Date.now();
    console.log(`Time: ${end - start}ms`);
  }

  _createMarkers() {
    const markers = {};
    this._destroyMarkers();
    this.get('records').each(record => {
      const locationId = record.get('LocationId');
      const memberUid = record.get('MemberUid');
      const member = this.get('members').findWhere({ uid: memberUid }).toJSON();
      const location = this.get('locations').findWhere({ id: locationId }).toJSON();
      if (!markers[locationId]) {
        markers[locationId] = {
          location,
          members: [member]
        };
      } else {
        markers[locationId].members.push(member);
      }
    });
    this.set('markers', markers);
  }

  _destroyMarkers() {
    _.each(this.get('markers'), marker => {
      if (typeof marker.unset === 'function') {
        marker.unset();
      }
    });
    this.unset('markers');
  }

}

export default MapModel;
