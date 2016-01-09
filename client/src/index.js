import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from './config';
import MapModel from './models/map';
import MapView from './views/map';
import LocationCollection from './collections/locations';
import MembersCollection from './collections/members';

class CSHMap {

  constructor(config) {
    console.log('Creating new CSHMap instance');
    this.config = new Config(config);
  }

  init() {
    let locationCollection = new LocationCollection();
    let membersCollection = new MembersCollection();
    $.when(
      locationCollection.init(), 
      membersCollection.init()
    ).done(function() {
      console.log('Locations', locationCollection.toJSON());
      console.log('Members', membersCollection.toJSON());
    }); 
    this.mapModel = new MapModel({
      config: this.config
    });
    this.mapView = new MapView({
      model: this.mapModel
    });
    this.mapView.render();
  }

}

window.CSHMap = CSHMap;
// export default CSHMap;
