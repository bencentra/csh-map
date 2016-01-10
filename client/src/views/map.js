import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import MapEvents from '../events';
// import mapTemplate from '../templates/map.html';

class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    console.log('Creating new MapView');
    this.el = document.querySelector('#csh-map-canvas');
    this.mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(37, -97), // Somewhere in Kansas
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false
    };
    this.googleMap = null;
    this.googleMarkers = [];
    MapEvents.on('ready', this.render, this);
  }

  render() {
    console.log('MapView render()');
    let locationId = null;
    this.googleMap = this.googleMap || new google.maps.Map(this.el, this.mapOptions);
    for (locationId in this.model.get('markers')) {
      let marker = this.model.get('markers')[locationId];
      marker.googleMarker = new google.maps.Marker({
        position: new google.maps.LatLng(marker.location.latitude, marker.location.longitude),
        title: marker.location.address,
        map: this.googleMap
      });
    }
    return this;
  }

}

export default MapView;
