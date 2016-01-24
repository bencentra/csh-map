import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

class InfoModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
  }

  getAddress() {
    this._setInfoProps();
    if (this.get('location')) {
      return this.get('location').get('address');
    }
    return false;
  }

  updateAddress(data) {
    let address = `${data.city}, ${data.state}, ${data.country}`;
    let defer = $.Deferred();
    defer.resolve();
    return defer.promise();
  }

  _geocodeAddress(address) {

  }

  removeFromMap() {
    let defer = $.Deferred();
    defer.resolve();
    return defer.promise();
  }

  _setInfoProps() {
    let member = this.get('map').get('members').findWhere({uid: this.get('config').uid});
    if (!member) return;
    let record = this.get('map').get('records').findWhere({MemberUid: member.get('uid')});
    if (!record) return;
    let location = this.get('map').get('locations').findWhere({id: record.get('LocationId')});
    if (!location) return;
    this.set('member', member);
    this.set('record', record);
    this.set('location', location);
  }

}

export default InfoModel;
