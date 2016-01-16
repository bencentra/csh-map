import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
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
    this.init().done(this._ready.bind(this));
  }

  init() {
    start = Date.now();
    return $.when(
      this.get('locations').init(),
      this.get('members').init(),
      this.get('records').init()
    );
  }

  _ready() {
    this.set('markers', this._createMarkers());
    MapEvents.trigger('ready');
    end = Date.now();
    console.log(`Time: ${end - start}ms`);
  }

  _createMarkers() {
    let markers = {};
    this.get('records').each(record => {
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
    });
    return markers;
  }

}

export default MapModel;
