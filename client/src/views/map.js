import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import MapEvents from '../events';
import infoWindowTemplate from '../templates/info-window.html';

class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    console.log('Creating new MapView');
    this.el = document.querySelector('#csh-map-canvas');
    this.gmapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(37, -97), // Somewhere in Kansas
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false
    };
    this.gmap = null;
    this._infoWindowTemplate = _.template(infoWindowTemplate);
    MapEvents.on('ready', this.render, this);
  }

  render() {
    console.log('MapView render()');
    let locationId = null;
    this.gmap = this.gmap || new google.maps.Map(this.el, this.gmapOptions);
    for (locationId in this.model.get('markers')) {
      let marker = this.model.get('markers')[locationId];
      marker.googleMarker = new google.maps.Marker({
        position: new google.maps.LatLng(marker.location.latitude, marker.location.longitude),
        title: marker.location.address,
        map: this.gmap
      });
      marker.infoWindow = new google.maps.InfoWindow({
        content: this._infoWindowTemplate(marker)
      });
      marker.googleMarker.addListener('click', function() {
        marker.infoWindow.open(this.gmap, marker.googleMarker);
      }.bind(this));
    }
    return this;
  }

}

export default MapView;
