import SearchView from '../../src/views/search/search';
import SearchModel from '../../src/models/search';
import ModalView from '../../src/views/modals/modal';
import Config from '../../src/config';
import MapEvents from '../../src/events';

describe('Search View', () => {

  let searchView = null;
  const mockConfig = new Config({
    uid: 'bencentra',
    cn: 'Ben Centra',
    hostUrl: 'http://localhost:8888',
    apiUrl: 'http://localhost:3000/v1',
  });
  const mockModel = new SearchModel({
    config: mockConfig,
    options: {},
  });
  const mockModalView = new ModalView({
    title: 'Search',
  });

  beforeEach(() => {
    searchView = new SearchView({
      model: mockModel,
      parentModal: mockModalView,
    });
  });

  it('can be constructed', () => {
    expect(searchView).toBeDefined();
    expect(searchView.model).toEqual(mockModel);
  });

  describe('render', () => {

    beforeEach(() => searchView.render());

    it('renders the template', () => {
      expect(searchView.$('.csh-map-search-type-btn').length).toBe(3);
      expect(searchView.$('.csh-map-search-type-btn[data-value="Name"]')
        .hasClass('btn-primary')).toBe(true);
      expect(searchView.$('.csh-map-search-type-btn[data-value="Username"]')
        .hasClass('btn-primary')).toBe(false);
      expect(searchView.$('.csh-map-search-type-btn[data-value="Address"]')
        .hasClass('btn-primary')).toBe(false);
      expect(searchView.$('#csh-map-search-input').length).toBe(1);
    });

    it('renders the search results', () => {
      expect(searchView.$('.no-result').length).toBe(1);
    });

  });

  describe('close', () => {

    it('clears the search query on the model', () => {
      searchView.model.set('query', 'asdf');
      searchView.close();
      expect(searchView.model.get('query')).toEqual('');
    });

  });

  describe('events', () => {

    beforeEach(() => searchView.render());

    it('changes the search type when a button is clicked', () => {
      searchView.$('.csh-map-search-type-btn[data-value="Username"]').click();
      expect(searchView.model.get('activeType')).toEqual('Username');
      expect(searchView.$('[data-value="Name"]').hasClass('.btn-primary')).toBe(false);
    });

    it('updates the search results on keyup (with debounce)', done => {
      const mockResults = [{
        label: 'Ben Centra',
        marker: {},
      }];
      spyOn(searchView.model, 'search').and.returnValue(mockResults);
      const query = 'b';
      searchView.$('#csh-map-search-input').val(query).trigger('keyup');
      setTimeout(() => {
        expect(searchView.model.get('query')).toBe(query);
        expect(searchView.$('.result').length).toBe(1);
        done();
      }, 400); // Double the expected wait time, to be safe
    });

    it('handles clicks on a search result', done => {
      spyOn(MapEvents, 'trigger');
      const mockResults = [{
        label: 'Ben Centra',
        marker: {},
      }];
      spyOn(searchView.model, 'search').and.returnValue(mockResults);
      const query = 'b';
      searchView.$('#csh-map-search-input').val(query).trigger('keyup');
      setTimeout(() => {
        searchView.$('.result').first().click();
        expect(MapEvents.trigger).toHaveBeenCalledWith('search-result', mockResults[0].marker);
        done();
      }, 400); // Double the expected wait time, to be safe
    });

  });

});
