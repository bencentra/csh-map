import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from './config';
import mainTemplate from './templates/main.html';
import MapEvents from './events';
import MapModel from './models/map';
import MapView from './views/map';
import ToolbarView from './views/toolbar';
import SearchView from './views/search';
import InfoView from './views/info';

const SELECTORS = {
  WRAPPER: '#csh-map',
  MAP: '#csh-map-canvas',
  TOOLBAR: '#csh-map-toolbar',
  SEARCH_MODAL: '#csh-map-search-modal',
  INFO_MODAL: '#csh-map-info-modal'
};

class CSHMap {

  constructor(config) {
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
    $(SELECTORS.WRAPPER).html(mainTemplate);
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
    $(SELECTORS.MAP).html(this.mapView.render().el);
  }

  _renderToolbar() {
    $(SELECTORS.TOOLBAR).html(this.toolbarView.render().el);
  }

  _renderSearchModal() {
    $(SELECTORS.SEARCH_MODAL).html(this.searchView.render().el);
  }

  _renderInfoModal() {
    $(SELECTORS.INFO_MODAL).html(this.infoView.render().el);
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
