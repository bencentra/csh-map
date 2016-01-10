import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from '../config';
import MapEvents from '../events';
import LocationCollection from '../collections/locations';
import MemberCollection from '../collections/members';
import RecordCollection from '../collections/records';

let start = null, end = null;

class MapModel extends Backbone.Model {

  constructor(options) {
    super(options);
    console.log('Creating new MapModel');
    this.set('config', Config.getInstance());
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
    console.log('Locations', this.get('locations').toJSON());
    console.log('Members', this.get('members').toJSON());
    console.log('Records', this.get('records').toJSON());
    this.set('markers', this._createMarkers());
    console.log('Markers', this.get('markers'));
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
    console.log('Markers', markers);
    return markers;
  }

}

export default MapModel;
