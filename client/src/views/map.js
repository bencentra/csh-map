import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import infoWindowTemplate from '../templates/info-window.html';

class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    this.gmapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(37, -97), // Somewhere in Kansas
      disableDefaultUI: true
    };
    this.gmap = null;
    this._infoWindowTemplate = _.template(infoWindowTemplate);
  }

  render() {
    this.gmap = this.gmap || new google.maps.Map(this.el, this.gmapOptions);
    this._createGoogleMapsMarkers();
    this.delegateEvents();
    return this;
  }

  _createGoogleMapsMarkers() {
    let locationId = null;
    for (locationId in this.model.get('markers')) {
      let marker = this.model.get('markers')[locationId];
      this._createGoogleMapsMarker(marker);
    }
  }

  _createGoogleMapsMarker(marker) {
    marker.googleMarker = new google.maps.Marker({
      position: new google.maps.LatLng(marker.location.latitude, marker.location.longitude),
      title: marker.location.address,
      map: this.gmap
    });
    marker.infoWindow = new google.maps.InfoWindow({
      content: this._infoWindowTemplate(marker)
    });
    marker.googleMarker.addListener('click', () => {
      marker.infoWindow.open(this.gmap, marker.googleMarker);
    }.bind(this));
  }

}

export default MapView;
