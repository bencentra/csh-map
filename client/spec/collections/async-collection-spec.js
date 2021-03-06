import AsyncCollection from '../../src/collections/async-collection';
import Backbone from 'backbone';

describe('Async Collection', () => {

  let asyncCollection = null;
  const mockSuccess = function (successCallback) {
    successCallback();
    return {
      error(errorCallback) {
        errorCallback();
      },
    };
  };

  beforeEach(() => {
    asyncCollection = new AsyncCollection();
  });

  it('can be constructed', () => {
    expect(asyncCollection).toBeDefined();
    expect(asyncCollection.config).toBeDefined();
  });

  describe('init()', () => {

    beforeEach(() => {
      spyOn(asyncCollection, 'fetch').and.returnValue({
        success: mockSuccess,
      });
    });

    it('calls Backbone.Collection.fetch', () => {
      asyncCollection.init();
      expect(asyncCollection.fetch).toHaveBeenCalled();
    });

    it('returns a promise', () => {
      const promise = asyncCollection.init();
      expect(typeof promise.then).toEqual('function');
    });

  });

  describe('addAndSync()', () => {

    const testModel = {};
    const testOptions = {};

    beforeEach(() => {
      spyOn(asyncCollection, 'add').and.returnValue(testModel);
      spyOn(Backbone, 'sync').and.returnValue({
        success: mockSuccess,
      });
    });

    it('adds a model to the collection', () => {
      asyncCollection.addAndSync('create', testModel, testOptions);
      expect(asyncCollection.add).toHaveBeenCalledWith(testModel, testOptions);
    });

    it('syncs the collection', () => {
      asyncCollection.addAndSync('create', testModel, testOptions);
      expect(Backbone.sync).toHaveBeenCalledWith('create', testModel);
    });

    it('returns a promise', () => {
      const promise = asyncCollection.addAndSync('create', testModel, testOptions);
      expect(typeof promise.then).toEqual('function');
    });

  });

});
