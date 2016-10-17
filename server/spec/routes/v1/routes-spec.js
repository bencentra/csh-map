var request = require('supertest');
var rewire = require('rewire');
var MapAPI = rewire('../../../src/app');

process.env.TESTING = true;

describe('v1 API routes', function () {

  var mapAPI = null; // MapAPI instance
  var app = null; // Express app
  var jsonRegex = /application\/json/;
  var membersLength = 0;
  var body = null;

  function initializeMap(done, options) {
    var opts = options || {};
    mapAPI = new MapAPI({
      port: 3001,
      env: 'development',
      origin: opts.origin || false
    });
    mapAPI.start().then(done);
    app = mapAPI.app;
  }

  describe('/', function () {

    beforeEach(function (done) {
      initializeMap(done);
    });

    it('GETs a welcome message', function (done) {
      request(app)
        .get('/v1/')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual({ message: 'Greetings from the CSH Map API (v1)' });
          expect(err).toBeFalsy();
          done();
        });
    });

    afterEach(function (done) {
      mapAPI.server.close(done);
    });

  });

  describe('/locations', function () {

    beforeEach(function (done) {
      initializeMap(done);
    });

    it('GETs a list of locations', function (done) {
      request(app)
        .get('/v1/locations')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(err).toBeFalsy();
          done();
        });
    });

    it('GETs a single location', function (done) {
      request(app)
        .get('/v1/locations/1')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
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

    it('POSTs a new location', function (done) {
      body = {
        address: 'Some Place, Some State, Some Country',
        latitude: 12.3456,
        longitude: 65.4321
      };
      request(app)
        .post('/v1/locations')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body.address).toEqual(body.address);
          expect(res.body.latitude).toEqual(body.latitude);
          expect(res.body.longitude).toEqual(body.longitude);
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    afterEach(function (done) {
      mapAPI.server.close(done);
    });

  });

  describe('/members', function () {

    beforeEach(function (done) {
      initializeMap(done);
    });

    it('GETs a list of members', function (done) {
      request(app)
        .get('/v1/members')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(err).toBeFalsy();
          membersLength = res.body.length;
          done();
        });
    });

    it('GETs a single member', function (done) {
      request(app)
        .get('/v1/members/bencentra')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.uid).toBeDefined();
          expect(res.body.cn).toBeDefined();
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    it('POSTs a new member', function (done) {
      body = {
        uid: 'jeid',
        cn: 'Julien Eid'
      };
      request(app)
        .post('/v1/members')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.uid).toEqual(body.uid);
          expect(res.body.cn).toEqual(body.cn);
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    it('PUTs an existing member', function (done) {
      body = {
        cn: 'Bon Contro'
      };
      request(app)
        .put('/v1/members/bencentra')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.success).toBe(true);
          expect(err).toBeFalsy();
          done();
        });
    });

    afterEach(function (done) {
      mapAPI.server.close(done);
    });

  });

  describe('/reasons', function () {

    beforeEach(function (done) {
      initializeMap(done);
    });

    it('GETs a list of reasons', function (done) {
      request(app)
        .get('/v1/reasons')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(err).toBeFalsy();
          done();
        });
    });

    it('GETs a single reason', function (done) {
      request(app)
        .get('/v1/reasons/1')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
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

    afterEach(function (done) {
      mapAPI.server.close(done);
    });

  });

  describe('/records', function () {

    beforeEach(function (done) {
      initializeMap(done);
    });

    it('GETs the most recent record for each user', function (done) {
      request(app)
        .get('/v1/records')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(res.body.length).toBe(membersLength);
          expect(err).toBeFalsy();
          done();
        });
    });

    it('GETs the complete list of all records', function (done) {
      request(app)
        .get('/v1/records/history')
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Array));
          expect(res.body.length).toBeGreaterThan(membersLength);
          expect(err).toBeFalsy();
          done();
        });
    });

    it('POSTs to add a member to the map', function (done) {
      body = {
        MemberUid: 'bencentra',
        LocationId: 1,
        ReasonId: 1
      };
      request(app)
        .post('/v1/records')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.MemberUid).toEqual(body.MemberUid);
          expect(res.body.LocationId).toEqual(body.LocationId);
          expect(res.body.ReasonId).toEqual(body.ReasonId);
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    it('POSTs to remove a member from the map', function (done) {
      body = {
        MemberUid: 'bencentra',
        LocationId: -1,
        ReasonId: 1
      };
      request(app)
        .post('/v1/records')
        .send(body)
        .expect(200)
        .expect('Content-Type', jsonRegex)
        .end(function (err, res) {
          expect(res.body).toEqual(jasmine.any(Object));
          expect(res.body.MemberUid).toEqual(body.MemberUid);
          expect(res.body.LocationId).toEqual(null);
          expect(res.body.ReasonId).toEqual(body.ReasonId);
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
          expect(err).toBeFalsy();
          done();
        });
    });

    afterEach(function (done) {
      mapAPI.server.close(done);
    });

  });

  describe('400 errors', function () {

    beforeEach(function (done) {
      initializeMap(done);
    });

    it('404s for unknown routes', function (done) {
      request(app)
        .get('/v1/lol')
        .expect(404)
        .end(function (err) {
          expect(err).toBeFalsy();
          done();
        });
    });

    afterEach(function (done) {
      mapAPI.server.close(done);
    });

  });

  describe('500 errors', function () {

    beforeEach(function (done) {
      initializeMap(done, {
        origin: 'https://members.csh.rit.edu'
      });
    });

    // TODO - This returns a 200 even though the origin headers are different...
    xit('500s on an invalid origin header', function (done) {
      request(app)
        .get('/v1/members')
        .set('Origin', 'http://wrongorigin.biz')
        .expect(500)
        .end(function (err, res) {
          console.log(res.req._headers);
          expect(err).toBeFalsy();
          done();
        });
    });

    xit('500s on error', function () {

    });

    afterEach(function (done) {
      mapAPI.server.close(done);
    });

  });

});
