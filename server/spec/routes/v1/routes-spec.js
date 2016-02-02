var request = require('supertest'),
    rewire = require('rewire'),
    MapAPI = rewire('../../../app');

describe('API V1 Routes', function() {

  var mapAPI = null,  // MapAPI instance
      app = null,     // Express app
      jsonRegex = /application\/json/;

  beforeEach(function(done) {
    mapAPI = new MapAPI({
      port: 3001,
      env: 'development'
    });
    mapAPI.init();
    mapAPI.start().then(done);
    app = mapAPI.app;
  });

  describe('/', function() {

    it('GETs a welcome message', function(done) {
      request(app)
        .get('/v1/')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual({message: 'Greetings from the CSH Map API (v1)'});
          expect(err).toBeFalsy();
          done();
        });
    });

  });

  describe('/locations', function() {

    it('GETs a list of locations', function(done) {
      request(app)
        .get('/v1/locations')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(err).toBeFalsy();
          done();
        });
    });

    it('GETs a single location', function(done) {
      request(app)
        .get('/v1/locations/1')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.address).toBeDefined();
          expect(res.body.latitude).toBeDefined();
          expect(res.body.longitude).toBeDefined();
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    it('POSTs a new location', function(done) {
      var body = {
        address: 'Some Place, Some State, Some Country',
        latitude: 12.3456,
        longitude: 65.4321
      };
      request(app)
        .post('/v1/locations')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body.address).toEqual(body.address);
          expect(res.body.latitude).toEqual(body.latitude);
          expect(res.body.longitude).toEqual(body.longitude);
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

  });

  describe('/members', function() {

  });

  describe('/reasons', function() {

  });

  describe('/records', function() {

  });

  describe('errors', function() {

    it('404s for unknown routes', function(done) {
      request(app)
        .get('/v1/lol')
        .expect(404, done);
    });

    xit('500s on error', function(done) {

    });

  });

  afterEach(function(done) {
    mapAPI.server.close(done);
  });

});
