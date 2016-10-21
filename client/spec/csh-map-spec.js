import MapEvents from '../src/events';
import Q from 'q';

describe('CSH Map', () => {

  let testConfig = null;
  let map = null;

  beforeEach(() => {
    $('body').append('<div id="csh-map"></div>');
    spyOn(MapEvents, 'on').and.callThrough();
    testConfig = {
      hostUrl: 'http://localhost:8888',
      apiUrl: 'http://localhost:3000/v1',
      uid: 'bencentra',
      cn: 'Ben Centra',
    };
    map = new CSHMap(testConfig);
  });

  afterEach(() => {
    $('#csh-map').remove();
  });

  it('is defined globally', () => {
    expect(CSHMap).toBeDefined();
  });

  describe('constructor', () => {

    it('creates a map instance', () => {
      expect(typeof map).toBe('object');
    });

    it('sets the config properties', () => {
      expect(map.config.uid).toBe(testConfig.uid);
      expect(map.config.cn).toBe(testConfig.cn);
      expect(map.config.hostUrl).toBe(testConfig.hostUrl);
      expect(map.config.apiUrl).toBe(testConfig.apiUrl);
    });

    it('initializes the models', () => {
      expect(map.mapModel).toBeDefined();
      expect(map.searchModel).toBeDefined();
      expect(map.infoModel).toBeDefined();
    });

    it('initializes the views', () => {
      expect(map.mapView).toBeDefined();
      expect(map.toolbarView).toBeDefined();
      expect(map.alertView).toBeDefined();
      expect(map.searchView).toBeDefined();
      expect(map.infoView).toBeDefined();
    });

    it('initializes the events', () => {
      expect(MapEvents.on).toHaveBeenCalledWith('center', map._centerMap, map);
      expect(MapEvents.on).toHaveBeenCalledWith('search', map._showSearchModal, map);
      expect(MapEvents.on).toHaveBeenCalledWith('search-result', map._showSearchResult, map);
      expect(MapEvents.on).toHaveBeenCalledWith('info', map._showInfoModal, map);
      expect(MapEvents.on).toHaveBeenCalledWith('update', map._loadMapDataAndRender, map);
      expect(MapEvents.on).toHaveBeenCalledWith('alert', map._showAlert, map);
    });

  });

  describe('init()', () => {

    beforeEach(done => {
      spyOn(map.mapModel, 'init').and.returnValue(Q(true));
      spyOn(map.mapView, 'render').and.callThrough();
      spyOn(map.toolbarView, 'render').and.callThrough();
      spyOn(map.alertView, 'render').and.callThrough();
      spyOn(map.searchModalView, 'render').and.callThrough();
      spyOn(map.searchView, 'render').and.callThrough();
      spyOn(map.infoModalView, 'render').and.callThrough();
      spyOn(map.infoView, 'render').and.callThrough();
      map.init().then(done);
    });

    it('gets data from the model', () => {
      expect(map.mapModel.init).toHaveBeenCalled();
    });

    it('appends the template to the DOM', () => {
      expect($('#csh-map-canvas').length).toBe(1);
      expect($('#csh-map-toolbar').length).toBe(1);
      expect($('#csh-map-alert').length).toBe(1);
      expect($('#csh-map-search-modal').length).toBe(1);
      expect($('#csh-map-info-modal').length).toBe(1);
    });

    it('renders the appropriate views', () => {
      expect(map.mapView.render).toHaveBeenCalled();
      expect(map.toolbarView.render).toHaveBeenCalled();
      expect(map.searchModalView.render).toHaveBeenCalled();
      expect(map.searchView.render).toHaveBeenCalled();
      expect(map.infoModalView.render).toHaveBeenCalled();
      expect(map.infoView.render).toHaveBeenCalled();
      expect(map.alertView.render).not.toHaveBeenCalled();
    });

  });

  describe('events', () => {

    beforeEach(done => {
      spyOn(map.mapModel, 'init').and.returnValue(Q(true));
      map.init().then(done);
    });

    xit('centers the map on "center" event', done => {
      MapEvents.trigger('center');
      setTimeout(() => {
        expect(map.mapView.gmap.setCenter).toHaveBeenCalledWith(map.mapView.gmapOptions.center);
        expect(map.mapView.gmap.setZoom).toHaveBeenCalledWith(map.mapView.gmapOptions.zoom);
        done();
      });
    });

    it('shows the search modal on "search" event', done => {
      spyOn(map.searchModalView, 'show');
      MapEvents.trigger('search');
      setTimeout(() => {
        expect(map.searchModalView.show).toHaveBeenCalled();
        done();
      });
    });

    it('focuses on the selected marker on "search-result" event', done => {
      spyOn(map.searchModalView, 'hide');
      MapEvents.trigger('search-result', {
        googleMarker: {},
      });
      setTimeout(() => {
        expect(map.searchModalView.hide).toHaveBeenCalled();
        expect(map.searchModel.get('query')).toEqual('');
        expect(google.maps.event.trigger).toHaveBeenCalledWith({}, 'click', {});
        done();
      });
    });

    it('shows the My Location modal on "info" event', done => {
      spyOn(map.infoModalView, 'show');
      MapEvents.trigger('info');
      setTimeout(() => {
        expect(map.infoModalView.show).toHaveBeenCalled();
        done();
      });
    });

    it('re-renders the map on "update" event', done => {
      map.mapModel.init.calls.reset();
      spyOn(map.mapView, 'render').and.callThrough();
      MapEvents.trigger('update');
      setTimeout(() => {
        expect(map.mapModel.init).toHaveBeenCalled();
        expect(map.mapView.render).toHaveBeenCalled();
        done();
      });
    });

    it('shows the alert on "alert" event', done => {
      spyOn(map.alertView, 'render').and.callThrough();
      MapEvents.trigger('alert', 'success', 'some message');
      setTimeout(() => {
        expect(map.alertView.data).toEqual(jasmine.objectContaining({
          type: 'success',
          message: 'some message',
        }));
        expect(map.alertView.render).toHaveBeenCalled();
        done();
      });
    });

  });

});
