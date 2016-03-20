import InfoModel from '../../src/models/info';
import MapModel from '../../src/models/map';
import Config from '../../src/config';
import Backbone from 'backbone';
import Q from 'q';

describe('InfoModel', () => {

  let infoModel = null;
  let mockMap = null;
  let mockAttributes = null;
  const mockOptions = {};
  const mockAddress = 'Boston, MA, USA';
  const mockConfig = new Config({
    uid: 'bencentra',
    cn: 'Ben Centra',
    hostUrl: 'http://localhost:8888',
    apiUrl: 'http://localhost:3000/v1'
  });
  const mockMember = new Backbone.Model({
    uid: mockConfig.uid,
    cn: mockConfig.cn
  });
  const mockLocation = new Backbone.Model({
    id: 1,
    address: mockAddress,
    latitude: 12,
    longitude: 34
  });
  const mockRecord = new Backbone.Model({
    MemberUid: mockMember.get('uid'),
    LocationId: mockLocation.get('id')
  });
  const mockSuccess = function(cb) {
    cb();
    return {
      error: function(cb) {
        // cb();
      }
    }
  };
  const mockGeocodeResults = [{
    formatted_address: mockAddress,
    geometry: {
      location: {
        lat: function() { return 12; },
        lng: function() { return 34; }
      }
    }
  }];

  beforeEach(() => {
    mockMap = new MapModel({mockConfig});
    mockAttributes = {
      config: mockConfig,
      map: mockMap
    };
    spyOn(InfoModel.prototype, 'defaults').and.callThrough();
    infoModel = new InfoModel(mockAttributes, mockOptions);
  });

  it('can be constructed', () => {
    expect(infoModel).toBeDefined();
    expect(infoModel.geocoder).toBeDefined();
  });

  it('sets some defaults', () => {
    expect(infoModel.defaults).toHaveBeenCalled();
  });

  describe('loadDataFromMap()', () => {

    beforeEach(() => {
      mockMap.get('members').add(mockMember);
      mockMap.get('records').add(mockRecord);
      mockMap.get('locations').add(mockLocation);
    });

    it('sets data from the MapModel', () => {
      infoModel.loadDataFromMap();
      expect(infoModel.get('member')).toEqual(mockMember);
      expect(infoModel.get('record')).toEqual(mockRecord);
      expect(infoModel.get('location')).toEqual(mockLocation);
      expect(infoModel.get('city')).toEqual('Boston');
      expect(infoModel.get('state')).toEqual('MA');
      expect(infoModel.get('country')).toEqual('USA');
    });

  });

  describe('removeFromMap()', () => {

    beforeEach(() => {
      spyOn(Backbone, 'sync').and.returnValue({
        success: mockSuccess
      });
      infoModel.set('member', mockMember);
    });

    it('removes the user from the map', (done) => {
      infoModel.removeFromMap().then(() => {
        const record = infoModel.get('map').get('records').pop();
        expect(record.get('MemberUid')).toEqual(mockMember.get('uid'));
        expect(record.get('LocationId')).toEqual(-1);
        expect(infoModel.defaults).toHaveBeenCalled();
        done();
      });
    });

  });

  describe('updateAddress()', () => {

    beforeEach(() => {
      spyOn(infoModel, '_geocodeAddress').and.returnValue(Q(true));
      spyOn(infoModel, '_createOrGetMember').and.returnValue(Q(true));
      spyOn(infoModel, '_createOrGetLocation').and.returnValue(Q(true));
      spyOn(infoModel, '_createMoveRecord').and.returnValue(Q(true));
      spyOn(infoModel, 'loadDataFromMap');
      infoModel.set({
        city: 'Boston',
        state: 'MA',
        country: 'USA'
      });
    });

    it('kicks off a promise chain', (done) => {
      const address = `${infoModel.get('city')}, ${infoModel.get('state')}, ${infoModel.get('country')}`;
      const promise = infoModel.updateAddress().then(() => {
        expect(infoModel._geocodeAddress).toHaveBeenCalledWith(address);
        expect(infoModel._createOrGetMember).toHaveBeenCalled();
        expect(infoModel._createOrGetLocation).toHaveBeenCalled();
        expect(infoModel._createMoveRecord).toHaveBeenCalled();
        expect(infoModel.loadDataFromMap).toHaveBeenCalled();
        done();
      });
      expect(promise.then).toBeDefined();
    });

  });

  describe('_geocodeAddress()', () => {

    it('geocodes an address', (done) => {
      spyOn(infoModel.geocoder, 'geocode').and.callFake((data, cb) => {
        cb(mockGeocodeResults, window.google.maps.GeocoderStatus.OK);
      });
      infoModel._geocodeAddress(mockAddress).then(() => {
        expect(infoModel.geocodeResult).toEqual(mockGeocodeResults[0]);
        done();
      });
    });

    it('returns an error if address can not be geocoded', (done) => {
      spyOn(infoModel.geocoder, 'geocode').and.callFake((data, cb) => {
        cb({}, window.google.maps.GeocoderStatus.NOT_OK);
      });
      infoModel._geocodeAddress(mockAddress).catch((error) => {
        expect(infoModel.geocodeResult).toEqual({});
        done();
      });
    });

  });

  describe('_createOrGetMember()', () => {

    beforeEach(() => {
      spyOn(Backbone, 'sync').and.returnValue({
        success: mockSuccess
      });
    });

    it('adds a non-existent member to the map', (done) => {
      infoModel._createOrGetMember().then(() => {
        expect(infoModel.updateData.member).toBeDefined();
        expect(infoModel.updateData.member.get('uid')).toEqual(mockConfig.uid);
        expect(infoModel.updateData.member.get('cn')).toEqual(mockConfig.cn);
        done();
      });
    });

    it('returns the pre-existing member', () => {
      infoModel.set('member', mockMember);
      const member = infoModel._createOrGetMember();
      expect(infoModel.updateData.member).toEqual(member);
    });

  });

  describe('_createOrGetLocation()', () => {

    beforeEach(() => {
      spyOn(Backbone, 'sync').and.returnValue({
        success: mockSuccess
      });
      infoModel.geocodeResult = mockGeocodeResults[0];
    });

    it('adds a non-existent location', (done) => {
      infoModel._createOrGetLocation().then(() => {
        expect(infoModel.updateData.location).toBeDefined();
        expect(infoModel.updateData.location.toJSON()).toEqual({
          address: mockGeocodeResults[0].formatted_address,
          latitude: mockGeocodeResults[0].geometry.location.lat(),
          longitude: mockGeocodeResults[0].geometry.location.lng()
        });
        done();
      });
    });

    it('returns the existing location', () => {
      infoModel.get('map').get('locations').add(mockLocation);
      const location = infoModel._createOrGetLocation();
      expect(infoModel.updateData.location).toEqual(location);
    });

  });

  describe('_createMoveRecord()', () => {

    beforeEach(() => {
      spyOn(Backbone, 'sync').and.returnValue({
        success: mockSuccess
      });
    });

    it('adds a record of the move', (done) => {
      infoModel.updateData = {
        member: mockMember,
        location: mockLocation
      };
      infoModel._createMoveRecord().then(() => {
        const record = infoModel.get('map').get('records').pop();
        expect(record.get('MemberUid')).toEqual(mockMember.get('uid'));
        expect(record.get('LocationId')).toEqual(mockLocation.get('id'));
        expect(infoModel.updateData).toEqual({});
        done();
      });
    });

  });

});
