import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Q from 'q';
import MapEvents from '../events';
import LocationCollection from '../collections/locations';
import MemberCollection from '../collections/members';
import RecordCollection from '../collections/records';

let start = null, end = null;

class MapModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.set('config', attributes.config);
    this.set('locations', new LocationCollection());
    this.set('members', new MemberCollection());
    this.set('records', new RecordCollection());
    this.set('markers', {});
    // this.init();
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
    // MapEvents.trigger('ready');
    end = Date.now();
    console.log(`Time: ${end - start}ms`);
  }

  _createMarkers() {
    let markers = {};
    this._destroyMarkers();
    this.get('records').each(record => {
      this._addMarker(record, markers);
    });
    this.set('markers', markers);
  }

  _addMarker(record, markers) {
    let member = this.get('members').findWhere({uid: record.get('MemberUid')}).toJSON();
    let location = this.get('locations').findWhere({id: record.get('LocationId')}).toJSON();
    if (!markers[record.get('LocationId')]) {
      markers[record.get('LocationId')] = {
        location: location,
        members: [member]
      };
    } else {
      markers[record.get('LocationId')].members.push(member);
    }
  }

  _destroyMarkers() {
    _.each(this.get('markers'), (marker) => {
      marker.googleMarker.setMap(null);
      marker.googleMarker = null;
    });
    this.unset('markers');
  }

}

export default MapModel;
