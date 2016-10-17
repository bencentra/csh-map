import Backbone from 'backbone';
import _ from 'underscore';

const searchTypes = {
  cn: 'Name',
  uid: 'Username',
  addr: 'Address',
};

/*
* Model for the search functionality.
*
* The search "algorithm" is pretty basic:
* - Take the query string and make it lowercase
* - Compare it to the corresponding field in each marker
* - If there's a substring match, add it to the results array
*/
class SearchModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.set('types', searchTypes);
    this.set('activeType', searchTypes.cn);
    this.set('query', '');
  }

  search() {
    const activeType = this.get('activeType');
    const formattedQuery = this.get('query').toLowerCase();
    let results = [];
    if (formattedQuery.length === 0) {
      console.log('empty search query');
    } else if (activeType === searchTypes.cn) {
      results = this._searchByName(formattedQuery);
    } else if (activeType === searchTypes.uid) {
      results = this._searchByUid(formattedQuery);
    } else if (activeType === searchTypes.addr) {
      results = this._searchByAddress(formattedQuery);
    } else {
      console.log('invalid search type');
    }
    return results;
  }

  _searchByName(query) {
    const results = [];
    const markers = _.clone(this.get('map').get('markers'));
    _.each(markers, marker => {
      _.each(marker.members, member => {
        if (member.cn.toLowerCase().indexOf(query) > -1) {
          results.push({
            label: member.cn,
            marker,
          });
        }
      });
    });
    return results;
  }

  _searchByUid(query) {
    const results = [];
    const markers = _.clone(this.get('map').get('markers'));
    _.each(markers, marker => {
      _.each(marker.members, member => {
        if (member.uid.toLowerCase().indexOf(query) > -1) {
          results.push({
            label: member.uid,
            marker,
          });
        }
      });
    });
    return results;
  }

  _searchByAddress(query) {
    const results = [];
    const markers = _.clone(this.get('map').get('markers'));
    _.each(markers, marker => {
      if (marker.location.address.toLowerCase().indexOf(query) > -1) {
        results.push({
          label: marker.location.address,
          marker,
        });
      }
    });
    return results;
  }

}

export default SearchModel;
