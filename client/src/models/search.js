import Backbone from 'backbone';

const searchTypes = {
  cn: 'Name',
  uid: 'Username',
  addr: 'Address',
};

class SearchModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.set('types', searchTypes);
    this.set('activeType', searchTypes.cn);
  }

  search(query) {
    const activeType = this.get('activeType');
    const formattedQuery = query.toLowerCase();
    let results = [];
    if (query.length === 0) {
      // Nope
    } else if (activeType === searchTypes.cn) {
      results = this._searchByName(formattedQuery);
    } else if (activeType === searchTypes.uid) {
      results = this._searchByUid(formattedQuery);
    } else if (activeType === searchTypes.addr) {
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
