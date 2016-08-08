import Backbone from 'backbone';

const SEARCH_TYPES = {
  NAME: 'cn',
  USERNAME: 'uid',
  ADDRESS: 'address',
};

class SearchModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.set('types', SEARCH_TYPES);
    this.set('type', SEARCH_TYPES.NAME);
  }

  search(query) {
    const type = this.get('type');
    const formattedQuery = query.toLowerCase();
    let results = [];
    if (query.length === 0) {
      // Nope
    } else if (type === SEARCH_TYPES.NAME) {
      results = this._searchByName(formattedQuery);
    } else if (type === SEARCH_TYPES.USERNAME) {
      results = this._searchByUid(formattedQuery);
    } else if (type === SEARCH_TYPES.ADDRESS) {
      results = this._searchByAddress(formattedQuery);
    } else {
      console.log('invalid search type');
    }
    console.log(results);
    return results;
  }

  _searchByName(query) {
    const members = this.get('map').get('members');
    return this._search(members, 'cn', query);
  }

  _searchByUid(query) {
    const members = this.get('map').get('members');
    return this._search(members, 'uid', query);
  }

  _searchByAddress(query) {
    const locations = this.get('map').get('locations');
    return this._search(locations, 'address', query);
  }

  _search(collection, field, query) {
    return collection.filter(item => {
      const formattedField = item.get(field).toLowerCase();
      return formattedField.indexOf(query) > -1;
    }).map(item => item.get(field));
  }

}

export default SearchModel;
