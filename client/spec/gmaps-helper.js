function MockMap(element, options) {
  this.elements = element;
  this.options = options;
  this.spy(element, options);
}
MockMap.prototype.spy = jasmine.createSpy('MockMap');
MockMap.prototype.setCenter = jasmine.createSpy('setCenter');
MockMap.prototype.setZoom = jasmine.createSpy('setZoom');

function MockGeocoder(params) {
  this.spy = jasmine.createSpy('MockGeocoder');
  this.spy(params);
}
MockGeocoder.prototype.geocode = function () {};

const MockGeocoderStatus = {
  OK: 1,
  NOT_OK: 2,
};

function MockLatLng(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
  this.spy(latitude, longitude);
}
MockLatLng.prototype.spy = jasmine.createSpy('MockLatLng');

function MockMarker(params) {
  this.position = params.position;
  this.title = params.title;
  this.map = this.map;
  this.spy(params);
}
MockMarker.prototype.spy = jasmine.createSpy('MockMarker');
MockMarker.prototype.setMap = function () {};
MockMarker.prototype.addListener = function () {};

function MockInfoWindow(params) {
  this.content = params.content;
  this.spy(params);
}
MockInfoWindow.prototype.spy = jasmine.createSpy('MockInfoWindow');
MockInfoWindow.prototype.open = function () {};

window.google = {
  maps: {
    Map: MockMap,
    Geocoder: MockGeocoder,
    GeocoderStatus: MockGeocoderStatus,
    LatLng: MockLatLng,
    Marker: MockMarker,
    InfoWindow: MockInfoWindow,
    event: {
      trigger: jasmine.createSpy('trigger'),
    },
  },
};
