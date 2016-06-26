describe('MapAPI', function () {

  var Promise = require('bluebird');
  var rewire = require('rewire');
  var MapAPI = rewire('../src/app');

  var apiInstance = null;
  var options = null;

  function instaResolve() {
    return Promise.resolve(true);
  }

  beforeEach(function () {
    apiInstance = null;
    options = {
      port: 3001,
      env: 'development'
    };
  });

  describe('constructor', function () {

    beforeEach(function () {
      spyOn(MapAPI.prototype, '_setupExpressInstance');
      spyOn(MapAPI.prototype, '_configureRoutes');
      spyOn(MapAPI.prototype, '_configureErrorHandlers');
      apiInstance = new MapAPI(options);
    });

    it('is a function', function () {
      expect(typeof MapAPI).toBe('function');
    });

    it('sets instance vars using options', function () {
      expect(apiInstance.options.port).toBe(options.port);
      expect(apiInstance.options.env).toBe(options.env);
    });

    it('creates the express instance', function () {
      expect(apiInstance._setupExpressInstance).toHaveBeenCalled();
      expect(apiInstance._configureRoutes).toHaveBeenCalled();
      expect(apiInstance._configureErrorHandlers).toHaveBeenCalled();
      expect(apiInstance.app).toBeDefined();
    });

  });

  describe('start()', function () {

    beforeEach(function () {
      apiInstance = new MapAPI(options);
      spyOn(apiInstance, '_startServer');
      spyOn(apiInstance, '_seedData').and.callFake(instaResolve);
      spyOn(apiInstance.db.sequelize, 'sync').and.callFake(instaResolve);
    });

    it('syncs the database', function (done) {
      apiInstance.start().then(function () {
        expect(apiInstance.db.sequelize.sync).toHaveBeenCalled();
        done();
      });
    });

    it('seeds data', function (done) {
      apiInstance.start().then(function () {
        expect(apiInstance._seedData).toHaveBeenCalled();
        done();
      });
    });

    it('starts the server', function (done) {
      apiInstance.start().then(function () {
        expect(apiInstance._startServer).toHaveBeenCalled();
        done();
      });
    });

  });

  describe('_setupExpressInstance()', function () {

  });

  describe('_configureRoutes()', function () {

  });

  describe('_startServer()', function () {

  });

  describe('_seedData()', function () {

  });

});
