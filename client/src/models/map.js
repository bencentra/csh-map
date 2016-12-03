import Backbone from 'backbone';
import _ from 'underscore';
import Q from 'q';
import LocationCollection from '../collections/locations';
import MemberCollection from '../collections/members';
import RecordCollection from '../collections/records';
import ReasonCollection from '../collections/reasons';

let start = null;
let end = null;

/*
* Model representing the map and all its data:
* - members: CSHers who have added themselves to the map
* - locations: Places where CSHers are or have been
* - records: Records of each move a CSHer has MapModel
* - reasons: Reasons a CSHer can record for why they moved
* - markers: Markers on the map, one per location with a list of members who reside there
*/
class MapModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.set('config', attributes.config);
    this.set('locations', new LocationCollection());
    this.set('members', new MemberCollection());
    this.set('records', new RecordCollection());
    this.set('reasons', new ReasonCollection());
    this.set('markers', {});
  }

  init() {
    start = Date.now();
    return Q.all([
      this.get('locations').init(),
      this.get('members').init(),
      this.get('records').init(),
      this.get('reasons').init(),
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

  // Create map markers from the raw data
  // TODO - Make markers a proper Backbone Collection, each marker a Backbone Models
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
          members: [member],
        };
      } else {
        markers[locationId].members.push(member);
      }
    });
    this.set('markers', markers);
  }

  // Reset the markers, removing them from the Google map along the way
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
