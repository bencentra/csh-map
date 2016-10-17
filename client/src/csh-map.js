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
import ModalView from './views/modals/modal';
import SearchView from './views/search/search';
import InfoView from './views/info';
import AlertView from './views/alert';

const SELECTORS = {
  WRAPPER: '#csh-map',
  MAP: '#csh-map-canvas',
  TOOLBAR: '#csh-map-toolbar',
  ALERT: '#csh-map-alert',
  SEARCH_MODAL: '#csh-map-search-modal',
  INFO_MODAL: '#csh-map-info-modal',
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
    // Primary model for the map
    this.mapModel = new MapModel({
      config: this.config,
    });
    // Model for handling searches
    this.searchModel = new SearchModel({
      config: this.config,
      map: this.mapModel,
    });
    // Model for handling the current user's information
    this.infoModel = new InfoModel({
      config: this.config,
      map: this.mapModel,
    });
  }

  _initViews() {
    $(SELECTORS.WRAPPER).html(mainTemplate);
    // Primary view for the map
    this.mapView = new MapView({
      model: this.mapModel,
    });
    // View for the toolbar
    this.toolbarView = new ToolbarView();
    // View for the success/failure message
    this.alertView = new AlertView();
    // Views for the "Search" modal
    this.searchModalView = new ModalView({
      title: 'Search',
    });
    this.searchView = new SearchView({
      model: this.searchModel,
      parentModal: this.searchModalView,
    });
    // Views for the "My Location" modal
    this.infoModalView = new ModalView({
      title: `${this.config.cn}'s Location`,
      buttons: {
        submit: 'Update',
      },
    });
    this.infoView = new InfoView({
      model: this.infoModel,
      parentModal: this.infoModalView,
    });
  }

  _initEvents() {
    MapEvents.on('center', this._centerMap, this);
    MapEvents.on('search', this._showSearchModal, this);
    MapEvents.on('search-result', this._showSearchResult, this);
    MapEvents.on('info', this._showInfoModal, this);
    MapEvents.on('update', this._loadMapDataAndRender, this);
    MapEvents.on('alert', this._showAlert, this);
  }

  // After loading map data, render each piece of the UI
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
    $(SELECTORS.SEARCH_MODAL).html(this.searchModalView.render().el);
  }

  _renderInfoModal() {
    $(SELECTORS.INFO_MODAL).html(this.infoModalView.render().el);
  }

  // Reset the position and zoom of the map
  _centerMap() {
    const options = this.mapView.gmapOptions;
    this.mapView.gmap.setCenter(options.center);
    this.mapView.gmap.setZoom(options.zoom);
  }

  _showSearchModal() {
    this.searchModalView.render().show();
  }

  _showSearchResult(marker) {
    this.searchModalView.hide();
    this.searchModel.set('query', '');
    google.maps.event.trigger(marker.googleMarker, 'click', {});
  }

  _showInfoModal() {
    this.infoModalView.render().show();
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
