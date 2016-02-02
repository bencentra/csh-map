var request = require('supertest'),
    rewire = require('rewire'),
    MapAPI = rewire('../../../app');

describe('v1 API routes', function() {

  var mapAPI = null,  // MapAPI instance
      app = null,     // Express app
      jsonRegex = /application\/json/,
      membersLength = 0;

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

    it('GETs a list of members', function(done) {
      request(app)
        .get('/v1/members')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(err).toBeFalsy();
          membersLength = res.body.length;
          done();
        });
    });

    it('GETs a single member', function(done) {
      request(app)
        .get('/v1/members/bencentra')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.uid).toBeDefined();
          expect(res.body.cn).toBeDefined();
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    it('POSTs a new member', function(done) {
      body = {
        uid: 'jeid',
        cn: 'Julien Eid'
      };
      request(app)
        .post('/v1/members')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.uid).toEqual(body.uid);
          expect(res.body.cn).toEqual(body.cn);
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    it('PUTs an existing member', function(done) {
      body = {
        cn: 'Bon Contro'
      };
      request(app)
        .put('/v1/members/bencentra')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(res.body[0]).toBe(1);
          expect(err).toBeFalsy();
          done();
        });
    });

  });

  describe('/reasons', function() {

    it('GETs a list of reasons', function(done) {
      request(app)
        .get('/v1/reasons')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(err).toBeFalsy();
          done();
        });
    });

    it('GETs a single reason', function(done) {
      request(app)
        .get('/v1/reasons/1')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBeDefined();
          expect(res.body.description).toBeDefined();
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

  });

  describe('/records', function() {

    it('GETs the most recent record for each user', function(done) {
      request(app)
        .get('/v1/records')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(res.body.length).toBe(membersLength);
          expect(err).toBeFalsy();
          done();
        });
    });

    it('GETs the complete list of all records', function(done) {
      request(app)
        .get('/v1/records/history')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(res.body.length).toBeGreaterThan(membersLength);
          expect(err).toBeFalsy();
          done();
        });
    });

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
