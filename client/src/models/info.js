import Backbone from 'backbone';
import Q from 'q';

class InfoModel extends Backbone.Model {

  constructor(attributes, options) {
    super(attributes, options);
    this.geocoder = new google.maps.Geocoder();
    this.geocodeResult = {};
    this.updateData = {};
    this.defaults();
  }

  defaults() {
    this.set({
      member: null,
      record: null,
      location: null,
      reason: 1, // "Not Specified"
      city: '',
      state: '',
      country: '',
    });
  }

  loadDataFromMap() {
    const member = this.get('map').get('members').findWhere({ uid: this.get('config').uid });
    if (!member) return;
    const record = this.get('map').get('records').findWhere({ MemberUid: member.get('uid') });
    if (!record) return;
    const location = this.get('map').get('locations').findWhere({ id: record.get('LocationId') });
    if (!location) return;
    const parts = location.get('address').split(', ');
    this.set({
      member,
      record,
      location,
      city: parts[0],
      state: parts[1],
      country: parts[2],
    });
  }

  updateAddress() {
    const address = `${this.get('city')}, ${this.get('state')}, ${this.get('country')}`;
    return this._geocodeAddress(address)
      .then(this._createOrGetMember.bind(this))
      .then(this._createOrGetLocation.bind(this))
      .then(this._createMoveRecord.bind(this))
      .then(this.loadDataFromMap.bind(this));
  }

  removeFromMap() {
    return this._removeMember()
      .then(this.defaults.bind(this));
  }

  _geocodeAddress(address) {
    const defer = Q.defer();
    this.geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.geocodeResult = results[0];
        defer.resolve();
      } else {
        defer.reject(new Error(`Failed to geocode address: ${status}`));
      }
    });
    return defer.promise;
  }

  _createOrGetMember() {
    let member = this.get('member');
    if (!member) {
      const defer = Q.defer();
      member = {
        uid: this.get('config').uid,
        cn: this.get('config').cn,
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
    let location = this.get('map').get('locations').findWhere({
      address: this.geocodeResult.formatted_address,
    });
    if (!location) {
      const defer = Q.defer();
      location = {
        address: this.geocodeResult.formatted_address,
        latitude: this.geocodeResult.geometry.location.lat(),
        longitude: this.geocodeResult.geometry.location.lng(),
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
    const record = {
      MemberUid: this.updateData.member.get('uid'),
      LocationId: this.updateData.location.get('id'),
      ReasonId: this.get('reason'),
    };
    return this.get('map').get('records').addAndSync('create', record)
      .then(() => {
        this.updateData = {};
      });
  }

  _removeMember() {
    const uid = this.get('member').get('uid');
    const record = {
      MemberUid: uid,
      LocationId: -1,
      ReasonId: this.get('reason'),
    };
    return this.get('map').get('records').addAndSync('create', record);
  }

}

export default InfoModel;
