import Backbone from 'backbone';
import LocationCollection from '../collections/locations';
import MemberCollection from '../collections/members';

const SEARCH_TYPES = {
  NAME: 'cn',
  USERNAME: 'uid',
  LOCATION: 'address'
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
    if (type === SEARCH_TYPES.NAME) {
      results = this._searchByName(formattedQuery);
    }
    else if (type === SEARCH_TYPES.USERNAME) {
      results = this._searchByUid(formattedQuery);
    }
    else if (type === SEARCH_TYPES.LOCATION){
      results = this._searchByAddress(formattedQuery);
    }
    else {
      console.log('invalid search type');
    }
    console.log(results);
    return results;
  }

  _searchByName(query) {
    return this._search(MemberCollection, 'cn', query);
  }

  _searchByUid(query) {
    return this._search(MemberCollection, 'uid', query);
  }

  _searchByAddress(query) {
    return this._search(LocationCollection, 'address', query);
  }

  _search(collection, field, query) {
    return collection.filter(item => {
      const formattedField = item.get(field).toLowerCase();
      return formattedField.indexOf(query) > -1;
    });
  }

}

export default SearchModel;
