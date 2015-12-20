var chai = require('chai');
var expect = chai.expect;
// var request = require('supertest');
// var rewire = require('rewire');
var app = require('../app');

describe('app', function() {

  describe('init()', function() {

    it('is defined', function() {
      expect(app.init).not.to.equal(undefined);
    });

  });

});
