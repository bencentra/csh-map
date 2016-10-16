import SearchModel from '../../src/models/search';
import MapModel from '../../src/models/map';
import Config from '../../src/config';

describe('SearchModel', () => {

  let searchModel = null;
  let mockMap = null;
  let mockAttributes = {};
  const mockOptions = {};
  const mockConfig = new Config({
    uid: 'bencentra',
    cn: 'Ben Centra',
    hostUrl: 'http://localhost:8888',
    apiUrl: 'http://localhost:3000/v1',
  });
  const mockMarkers = {
    1: {
      googleMarker: {},
      infoWindow: {},
      location: {
        address: 'Cambridge, MA, USA',
      },
      members: [{
        cn: 'Grant Cohoe',
        uid: 'cohoe',
      }],
    },
    2: {
      googleMarker: {},
      infoWindow: {},
      location: {
        address: 'San Fransisco, CA, USA',
      },
      members: [{
        cn: 'Ben Centra',
        uid: 'bencentra',
      }, {
        cn: 'Josh McSaveney',
        uid: 'mcsaucy',
      }],
    },
  };

  beforeEach(() => {
    mockMap = new MapModel({ mockConfig });
    mockMap.set('markers', mockMarkers);
    mockAttributes = {
      config: mockConfig,
      map: mockMap,
    };
    searchModel = new SearchModel(mockAttributes, mockOptions);
  });

  it('can be constructed', () => {
    expect(searchModel).toBeDefined();
    expect(searchModel.get('types')).toEqual(jasmine.any(Object));
    expect(searchModel.get('activeType')).toEqual('Name');
    expect(searchModel.get('query')).toEqual('');
  });

  describe('search()', () => {

    let result = null;

    beforeEach(() => {
      result = null;
    });

    it('returns an empty array if the search query is empty', () => {
      searchModel.set('query', '');
      result = searchModel.search();
      expect(result).toEqual([]);
    });

    it('returns an empty array if the search type is invalid', () => {
      searchModel.set('activeType', 'lol');
      searchModel.set('query', 'ben');
      result = searchModel.search();
      expect(result).toEqual([]);
    });

    it('returns a list of names if the search type is Name', () => {
      searchModel.set('activeType', searchModel.get('types').cn);
      searchModel.set('query', 'ben');
      result = searchModel.search();
      expect(result).toEqual([{
        label: 'Ben Centra',
        marker: jasmine.any(Object),
      }]);
    });

    it('returns a list of usernames if the search type is Username', () => {
      searchModel.set('activeType', searchModel.get('types').uid);
      searchModel.set('query', 'ben');
      result = searchModel.search();
      expect(result).toEqual([{
        label: 'bencentra',
        marker: jasmine.any(Object),
      }]);
    });

    it('returns a list of locations if the search type is Address', () => {
      searchModel.set('activeType', searchModel.get('types').addr);
      searchModel.set('query', 'cam');
      result = searchModel.search();
      expect(result).toEqual([{
        label: 'Cambridge, MA, USA',
        marker: jasmine.any(Object),
      }]);
    });

    it('handles uppercase searches', () => {
      searchModel.set('activeType', searchModel.get('types').cn);
      searchModel.set('query', 'BEN');
      result = searchModel.search();
      expect(result).toEqual([{
        label: 'Ben Centra',
        marker: jasmine.any(Object),
      }]);
    });

    it('handles mixed-case searches', () => {
      searchModel.set('activeType', searchModel.get('types').cn);
      searchModel.set('query', 'Ben');
      result = searchModel.search();
      expect(result).toEqual([{
        label: 'Ben Centra',
        marker: jasmine.any(Object),
      }]);
    });

  });

});
