import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from './config';
import MapEvents from './events';
import MapModel from './models/map';
import MapView from './views/map';
import ToolbarView from './views/toolbar';

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
    this.toolbarView = new ToolbarView();
    MapEvents.on('ready', this._render, this);
  }

  _render() {
    this._renderMap();
    this._renderToolbar();
  }

  _renderMap() {
    $('#csh-map-canvas').html(this.mapView.render().el);
    this.mapView.delegateEvents();
  }

  _renderToolbar() {
    $('#csh-map-toolbar').html(this.toolbarView.render().el);
    this.toolbarView.delegateEvents();
  }

}

// "Export" jQuery for Bootstrap
window.$ = window.jQuery = $;
// "Export" CSHMap to global namespace
window.CSHMap = CSHMap;
