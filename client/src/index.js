import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from './config';
import MapEvents from './events';
import MapModel from './models/map';
import MapView from './views/map';
import ToolbarView from './views/toolbar';
import SearchView from './views/search';
import InfoView from './views/info';

const WRAPPER_SELECTOR = '#csh-map';
const MAP_SELECTOR = '#csh-map-canvas';
const TOOLBAR_SELECTOR = '#csh-map-toolbar';
const SEARCH_MODAL_SELECTOR = '#csh-map-search-modal';
const INFO_MODAL_SELECTOR = '#csh-map-info-modal';

class CSHMap {

  constructor(config) {
    console.log('Creating new CSHMap instance');
    this.config = new Config(config);
  }

  init() {
    this.mapModel = new MapModel({
      config: this.config
    });
    this._initViews();
    this._initEvents();
  }

  _initViews() {
    this.mapView = new MapView({
      model: this.mapModel
    });
    this.toolbarView = new ToolbarView();
    this.searchView = new SearchView({
      config: this.config
    });
    this.infoView = new InfoView({
      config: this.config
    });
  }

  _initEvents() {
    MapEvents.on('ready', this._render, this);
    MapEvents.on('search', this._showSearchModal, this);
    MapEvents.on('info', this._showInfoModal, this);
  }

  _render() {
    this._renderMap();
    this._renderToolbar();
    this._renderSearchModal();
    this._renderInfoModal();
  }

  _renderMap() {
    $(MAP_SELECTOR).html(this.mapView.render().el);
    this.mapView.delegateEvents();
  }

  _renderToolbar() {
    $(TOOLBAR_SELECTOR).html(this.toolbarView.render().el);
    this.toolbarView.delegateEvents();
  }

  _renderSearchModal() {
    $(SEARCH_MODAL_SELECTOR).html(this.searchView.render().el);
    this.searchView.delegateEvents();
  }

  _renderInfoModal() {
    $(INFO_MODAL_SELECTOR).html(this.infoView.render().el);
    this.infoView.delegateEvents();
  }

  _showSearchModal() {
    this.searchView.show();
  }

  _showInfoModal() {
    this.infoView.show();
  }

}

// "Export" jQuery for Bootstrap
window.$ = window.jQuery = $;
// "Export" CSHMap to global namespace
window.CSHMap = CSHMap;
