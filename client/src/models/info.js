import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Q from 'q';

class InfoModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.geocoder = new google.maps.Geocoder();
    this.geocodeResult = {};
    this.updateData = {};
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
    return this._geocodeAddress(address)
      // .then(this._updateAddress)
      .then(this._createOrGetMember.bind(this))
      .then(this._createOrGetLocation.bind(this))
      .then(this._createMoveRecord.bind(this));
  }

  _geocodeAddress(address) {
    let defer = Q.defer();
    this.geocoder.geocode({address}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.geocodeResult = results[0];
        console.log(this.geocodeResult);
        defer.resolve();
      } else {
        defer.reject(new Error('Failed to geocode address: ' + status));
      }
    });
    return defer.promise;
  }

  _createOrGetMember() {
    let member = this.get('member');
    if (!member) {
      member = {
        uid: this.get('config').uid,
        cn: this.get('config').cn
      };
      return this.get('map').get('members').addAndSync(member)
        .then(memberModel => {
          this.updateData.member = memberModel;
        });
    }
    this.updateData.member = member;
    return member;
  }

  _createOrGetLocation() {
    let location = this.get('map').get('locations').findWhere({address: this.geocodeResult.formatted_address});
    if (!location) {
      location = {
        address: this.geocodeResult.formatted_address,
        latitude: this.geocodeResult.geometry.location.lat(),
        longitude: this.geocodeResult.geometry.location.lng()
      };
      return this.get('map').get('locations').addAndSync(location)
        .then(locationModel => {
          this.updateData.location = locationModel;
        });
    }
    this.updateData.location = location;
    return location;
  }

  _createMoveRecord() {
    let record = {
      MemberUid: this.updateData.member.get('uid'),
      LocationId: this.updateData.location.get('id'),
      ReasonId: 1 // TODO - Implement reason selecting
    };
    return this.get('map').get('records').addAndSync(record)
      .then(recordModel => {
        console.log(recordModel);
        this.updateData = {};
      });
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
    console.log(member, location, record);
    this.set('member', member);
    this.set('record', record);
    this.set('location', location);
  }

}

export default InfoModel;
