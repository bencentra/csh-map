describe('MapAPI', function() {

  var Promise = require('bluebird');
  var rewire = require('rewire');
  var MapAPI = rewire('../app');

  function instaResolve() {
    return Promise.resolve(true);
  }

  describe('constructor', function() {

    it('is a function', function() {

    });

    it('takes an options hash', function() {

    });

    it('sets up the express app', function() {

    });

  });

  describe('init()', function() {

    var apiInstance = null;
    var options = {
      port: 3000,
      env: 'development'
    };

    function createSpies() {
      spyOn(apiInstance, '_startServer');
      spyOn(apiInstance, '_seedData').and.callFake(instaResolve);
      spyOn(apiInstance.db.sequelize, 'sync').and.callFake(instaResolve);
    }

    beforeEach(function() {
      apiInstance = new MapAPI(options);
      createSpies();
    });

    it('is defined', function() {
      expect(apiInstance.init).toBeDefined();
    });

    it('syncs the database', function() {
      apiInstance.init();
      expect(apiInstance.db.sequelize.sync).toHaveBeenCalled();
    });

    xit('seeds data', function() {
      apiInstance.init();
      expect(apiInstance._seedData).toHaveBeenCalled();
    });

    xit('starts the server', function() {
      apiInstance.init();
      expect(apiInstance._startServer).toHaveBeenCalled();
    });

  });

});
