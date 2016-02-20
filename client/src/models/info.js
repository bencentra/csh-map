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
      let address = this.get('location').get('address');
      let parts = address.split(', ');
      return {
        city: parts[0] || '',
        state: parts[1] || '',
        country: parts[2] || ''
      };
    }
    return false;
  }

  updateAddress(data) {
    let address = `${data.city}, ${data.state}, ${data.country}`;
    return this._geocodeAddress(address)
      .then(this._createOrGetMember.bind(this))
      .then(this._createOrGetLocation.bind(this))
      .then(this._createMoveRecord.bind(this));
  }

  removeFromMap() {
    return this._removeMember();
  }

  _geocodeAddress(address) {
    let defer = Q.defer();
    this.geocoder.geocode({address}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.geocodeResult = results[0];
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
      let defer = Q.defer();
      member = {
        uid: this.get('config').uid,
        cn: this.get('config').cn
      };
      member = this.get('map').get('members').add(member);
      member.sync('create', member)
        .success(response => {
          member.set(response);
          this.updateData.member = member;
          defer.resolve();
        }).error(error => {
          defer.reject(error);
        });
      return defer.promise;
    }
    this.updateData.member = member;
    return member;
  }

  _createOrGetLocation() {
    let location = this.get('map').get('locations').findWhere({address: this.geocodeResult.formatted_address});
    if (!location) {
      let defer = Q.defer();
      location = {
        address: this.geocodeResult.formatted_address,
        latitude: this.geocodeResult.geometry.location.lat(),
        longitude: this.geocodeResult.geometry.location.lng()
      };
      location = this.get('map').get('locations').add(location);
      location.sync('create', location)
        .success(response => {
          location.set(response);
          this.updateData.location = location;
          defer.resolve();
        }).error(error => {
          defer.reject(error);
        });
      return defer.promise;
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
    return this.get('map').get('records').addAndSync('create', record)
      .then(recordModel => {
        this.updateData = {};
      });
  }

  _removeMember() {
    let uid = this.get('member').get('uid');
    let record = {
      MemberUid: uid,
      LocationId: -1,
      ReasonId: 1 // "Other"
    };
    return this.get('map').get('records').addAndSync('create', record);
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
