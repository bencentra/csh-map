import MapEvents from '../src/events';

describe('CSH Map', () => {

  let testConfig = null;

  beforeEach(() => {
    testConfig = {
      hostUrl: 'http://localhost:8888',
      apiUrl: 'http://localhost:3000/v1',
      uid: 'bencentra',
      cn: 'Ben Centra',
    };
  });

  it('is defined globally', () => {
    expect(CSHMap).toBeDefined();
  });

  describe('constructor', () => {

    let map = null;

    beforeEach(() => {
      map = new CSHMap(testConfig);
    });

    it('creates a map instance', () => {
      expect(typeof map).toBe('object');
    });

    it('sets the config properties', () => {
      expect(map.config.uid).toBe(testConfig.uid);
      expect(map.config.cn).toBe(testConfig.cn);
      expect(map.config.hostUrl).toBe(testConfig.hostUrl);
      expect(map.config.apiUrl).toBe(testConfig.apiUrl);
    });

  });

  describe('init()', () => {

    let map = null;

    beforeEach(() => {
      spyOn(MapEvents, 'on');
      map = new CSHMap(testConfig);
      spyOn(map, '_render');
    });

    it('initializes the models', () => {
      map.init();
      expect(map.mapModel).toBeDefined();
      expect(map.searchModel).toBeDefined();
      expect(map.infoModel).toBeDefined();
    });

    it('initializes the views', () => {
      map.init();
      expect(map.mapView).toBeDefined();
      expect(map.toolbarView).toBeDefined();
      expect(map.alertView).toBeDefined();
      expect(map.searchView).toBeDefined();
      expect(map.infoView).toBeDefined();
    });

    it('initializes the events', () => {
      map.init();
      expect(MapEvents.on).toHaveBeenCalledWith('search', map._showSearchModal, map);
      expect(MapEvents.on).toHaveBeenCalledWith('info', map._showInfoModal, map);
      expect(MapEvents.on).toHaveBeenCalledWith('update', map._loadMapDataAndRender, map);
      expect(MapEvents.on).toHaveBeenCalledWith('alert', map._showAlert, map);
    });

    it('renders the page', () => {
      map.init();
      expect(map._render).toHaveBeenCalled();
    });

  });

});
