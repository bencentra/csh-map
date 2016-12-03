import MapModel from '../../src/models/map';
import Config from '../../src/config';
import Q from 'q';

describe('MapModel', () => {

  let mapModel = null;
  const mockConfig = new Config({
    uid: 'bencentra',
    cn: 'Ben Centra',
    hostUrl: 'http://localhost:8888',
    apiUrl: 'http://localhost:3000/v1',
  });
  const testLocations = [
    { id: 1, address: 'Boston, MA, USA', latitude: 12, longitude: 34 },
    { id: 2, address: 'San Fransisco, CA, USA', latitude: 43, longitude: 21 },
  ];
  const testMembers = [
    { uid: 'bencentra', cn: 'Ben Centra' },
    { uid: 'mcsaucy', cn: 'Josh McSaveney' },
    { uid: 'cohoe', cn: 'Grant Cohoe' },
  ];
  const testReasons = [
    { id: 1, name: 'Other', description: 'Other' },
  ];
  const testRecords = [
    { LocationId: 2, MemberUid: 'mcsaucy', ReasonId: 1 },
    { LocationId: 1, MemberUid: 'cohoe', ReasonId: 1 },
    { LocationId: 2, MemberUid: 'bencentra', ReasonId: 1 },
  ];

  function fakeInit(asyncCollection, state) {
    return function () {
      asyncCollection.add(state);
      return Q(true);
    };
  }

  beforeEach(() => {
    mapModel = new MapModel({
      config: mockConfig,
    });
  });

  it('can be constructed', () => {
    expect(mapModel).toBeDefined();
    expect(mapModel.get('config')).toEqual(mockConfig);
    expect(mapModel.get('locations')).toBeDefined();
    expect(mapModel.get('members')).toBeDefined();
    expect(mapModel.get('records')).toBeDefined();
    expect(mapModel.get('markers')).toEqual({});
  });

  describe('init()', () => {

    beforeEach(() => {
      spyOn(mapModel.get('locations'), 'init').and.callFake(fakeInit(mapModel.get('locations'), testLocations));
      spyOn(mapModel.get('members'), 'init').and.callFake(fakeInit(mapModel.get('members'), testMembers));
      spyOn(mapModel.get('records'), 'init').and.callFake(fakeInit(mapModel.get('records'), testRecords));
      spyOn(mapModel.get('reasons'), 'init').and.callFake(fakeInit(mapModel.get('reasons'), testReasons));
    });

    it('creates the map marker data', done => {
      mapModel.init().then(() => {
        expect(mapModel.get('locations').init).toHaveBeenCalled();
        expect(mapModel.get('members').init).toHaveBeenCalled();
        expect(mapModel.get('records').init).toHaveBeenCalled();
        const markers = mapModel.get('markers');
        expect(markers[10]).not.toBeDefined();
        expect(markers[1].location.address).toEqual(testLocations[0].address); // Boston
        expect(markers[1].members[0].uid).toEqual(testMembers[2].uid); // cohoe
        expect(markers[2].location.address).toEqual(testLocations[1].address); // San Fransisco
        expect(markers[2].members[0].uid).toEqual(testMembers[1].uid); // mcsaucy
        expect(markers[2].members[1].uid).toEqual(testMembers[0].uid); // bencentra
        done();
      });
    });

  });

});
