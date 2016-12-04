import Backbone from 'backbone';
import _ from 'underscore';
import infoWindowTemplate from '../templates/info-window.html';

/*
* View for the map itself.
*
* Initializes the Google Maps instance and creates the map markers.
*/
class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    // Options for initializing Google Maps
    this.gmapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(37, -97), // Somewhere in Kansas
      disableDefaultUI: true,
    };
    // Google Maps map instance
    this.gmap = null;
    // Template used for the "info window" (marker popup bubble)
    this._infoWindowTemplate = _.template(infoWindowTemplate);
  }

  render() {
    this.gmap = this.gmap || new google.maps.Map(this.el, this.gmapOptions);
    this._createGoogleMapsMarkers();
    this.delegateEvents();
    return this;
  }

  // For each "marker" on the map, create a corresponding Google Maps Marker
  _createGoogleMapsMarkers() {
    const markers = this.model.get('markers');
    _.each(markers, marker => {
      const decorator = this._createGoogleMapsDecorator(marker);
      _.extend(marker, decorator);
    });
  }

  // Decorate a map "marker" with Google Maps Marker functionality
  _createGoogleMapsDecorator(marker) {
    const decorator = {};
    // Create the Marker
    decorator.googleMarker = new google.maps.Marker({
      position: new google.maps.LatLng(marker.location.latitude, marker.location.longitude),
      title: marker.location.address,
      map: this.gmap,
    });
    // Create the Marker's "info window"
    decorator.infoWindow = new google.maps.InfoWindow({
      content: this._infoWindowTemplate(marker),
    });
    // On click, show the Marker's "info window" and center the map on the Marker
    decorator.googleMarker.addListener('click', () => {
      decorator.infoWindow.open(this.gmap, decorator.googleMarker);
      this.gmap.setCenter(decorator.googleMarker.position);
      if (this.gmap.getZoom() < 6) {
        this.gmap.setZoom(6);
      }
    });
    // Create a method for removing the Google Maps Marker from the map
    decorator.unset = function unset() {
      this.googleMarker.setMap(null);
      this.googleMarker = null;
    };
    return decorator;
  }

}

export default MapView;
