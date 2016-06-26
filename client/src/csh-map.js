import $ from 'jquery';
import Spinner from 'spin.js';
import Config from './config';
import mainTemplate from './templates/main.html';
import MapEvents from './events';
import MapModel from './models/map';
import SearchModel from './models/search';
import InfoModel from './models/info';
import MapView from './views/map';
import ToolbarView from './views/toolbar';
import SearchView from './views/search';
import InfoView from './views/info';
import AlertView from './views/alert';

const SELECTORS = {
  WRAPPER: '#csh-map',
  MAP: '#csh-map-canvas',
  TOOLBAR: '#csh-map-toolbar',
  ALERT: '#csh-map-alert',
  SEARCH_MODAL: '#csh-map-search-modal',
  INFO_MODAL: '#csh-map-info-modal'
};

/*
* Primary CSHMap "controller" class
*/
class CSHMap {

  constructor(config) {
    this.config = new Config(config);
  }

  init() {
    this._initModels();
    this._initViews();
    this._initEvents();
    return this._render();
  }

  _initModels() {
    this.mapModel = new MapModel({
      config: this.config
    });
    this.searchModel = new SearchModel({
      config: this.config,
      map: this.mapModel
    });
    this.infoModel = new InfoModel({
      config: this.config,
      map: this.mapModel
    });
  }

  _initViews() {
    $(SELECTORS.WRAPPER).html(mainTemplate);
    this.mapView = new MapView({
      model: this.mapModel
    });
    this.toolbarView = new ToolbarView();
    this.alertView = new AlertView();
    this.searchView = new SearchView({
      model: this.searchModel
    });
    this.infoView = new InfoView({
      model: this.infoModel
    });
  }

  _initEvents() {
    MapEvents.on('search', this._showSearchModal, this);
    MapEvents.on('info', this._showInfoModal, this);
    MapEvents.on('update', this._loadMapDataAndRender, this);
    MapEvents.on('alert', this._showAlert, this);
  }

  _render() {
    return this._loadMapDataAndRender()
      .then(this._renderToolbar.bind(this))
      .then(this._renderSearchModal.bind(this))
      .then(this._renderInfoModal.bind(this))
      .catch(error => {
        console.error(error);
      });
  }

  _loadMapDataAndRender() {
    return this.mapModel.init()
      .then(this._renderMap.bind(this));
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
    this.searchView.render().show();
  }

  _showInfoModal() {
    this.infoView.render().show();
  }

  _showAlert(type, message) {
    this.alertView.setData(type, message);
    $(SELECTORS.ALERT).html(this.alertView.render().el);
  }

}

// "Export" jQuery for Bootstrap
window.$ = window.jQuery = $;
// "Export" spin.js
window.Spinner = Spinner;
// "Export" CSHMap to global namespace
window.CSHMap = CSHMap;

export default CSHMap;
