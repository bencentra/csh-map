describe('MapAPI', function() {

  var Promise = require('bluebird');
  var rewire = require('rewire');
  var MapAPI = rewire('../app');

  var apiInstance = null;
  var options = null;

  function instaResolve() {
    return Promise.resolve(true);
  }

  beforeEach(function() {
    apiInstance = null;
    options = {
      port: 3001,
      env: 'development'
    };
  });

  describe('constructor', function() {

    it('is a function', function() {
      expect(typeof MapAPI).toBe('function');
    });

    it('sets instance vars using options', function() {
      apiInstance = new MapAPI(options);
      expect(apiInstance.port).toBe(options.port);
      expect(apiInstance.env).toBe(options.env);
    });

  });

  describe('init()', function() {

    beforeEach(function() {
      apiInstance = new MapAPI(options);
      spyOn(apiInstance, '_setupExpressInstance');
      spyOn(apiInstance, '_configureRoutes');
      spyOn(apiInstance, '_configureErrorHandlers');
    });

    it('is defined', function() {
      expect(apiInstance.init).toBeDefined();
    });

    it('creates the express instance', function() {
      apiInstance.init();
      expect(apiInstance._setupExpressInstance).toHaveBeenCalled();
      expect(apiInstance._configureRoutes).toHaveBeenCalled();
      expect(apiInstance._configureErrorHandlers).toHaveBeenCalled();
      expect(apiInstance.app).toBeDefined();
    });

  });

  describe('start()', function() {

    beforeEach(function() {
      apiInstance = new MapAPI(options);
      spyOn(apiInstance, '_startServer');
      spyOn(apiInstance, '_seedData').and.callFake(instaResolve);
      spyOn(apiInstance.db.sequelize, 'sync').and.callFake(instaResolve);
      apiInstance.init();
    });

    it('syncs the database', function(done) {
      apiInstance.start().then(function() {
        expect(apiInstance.db.sequelize.sync).toHaveBeenCalled();
        done();
      });
    });

    it('seeds data', function(done) {
      apiInstance.start().then(function() {
        expect(apiInstance._seedData).toHaveBeenCalled();
        done();
      });
    });

    it('starts the server', function(done) {
      apiInstance.start().then(function() {
        expect(apiInstance._startServer).toHaveBeenCalled();
        done();
      });
    });

  });

  describe('_setupExpressInstance()', function() {

  });

  describe('_configureRoutes()', function() {

  });

  describe('_startServer()', function() {

  });

  describe('_seedData()', function() {

  });

});
