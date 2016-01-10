import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from './config';
import MapModel from './models/map';
import MapView from './views/map';

class CSHMap {

  constructor(config) {
    console.log('Creating new CSHMap instance');
    this.config = new Config(config);
  }

  init() {
    this.mapModel = new MapModel();
    this.mapView = new MapView({
      model: this.mapModel
    });
    // this.mapView.render();
  }

}

window.CSHMap = CSHMap;
// export default CSHMap;
