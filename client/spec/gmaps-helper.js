window.google = {
  maps: {
    Geocoder: function() {
      return {
        geocode: function() {}
      }
    },
    GeocoderStatus: {
      OK: 1,
      NOT_OK: 2
    },
    LatLng: function() {
      return {};
    }
  }
}
