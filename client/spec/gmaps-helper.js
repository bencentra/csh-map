window.google = {
  maps: {
    Geocoder: function() {
      return jasmine.createSpyObj('geocoder', ['geocode']);
    },
    LatLng: function() {
      return {};
    }
  }
}
