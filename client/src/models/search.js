import Backbone from 'backbone';
import _ from 'underscore';

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
    this.set('query', '');
  }

  search() {
    const activeType = this.get('activeType');
    const formattedQuery = this.get('query').toLowerCase();
    let results = [];
    if (formattedQuery.length === 0) {
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
