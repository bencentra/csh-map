import Backbone from 'backbone';
import _ from 'underscore';
import infoWindowTemplate from '../templates/info-window.html';

class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    this.gmapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(37, -97), // Somewhere in Kansas
      disableDefaultUI: true,
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
    const markers = this.model.get('markers');
    _.each(markers, marker => {
      const decorator = this._createGoogleMapsDecorator(marker);
      _.extend(marker, decorator);
    });
  }

  _createGoogleMapsDecorator(marker) {
    const decorator = {};
    decorator.googleMarker = new google.maps.Marker({
      position: new google.maps.LatLng(marker.location.latitude, marker.location.longitude),
      title: marker.location.address,
      map: this.gmap,
    });
    decorator.infoWindow = new google.maps.InfoWindow({
      content: this._infoWindowTemplate(marker),
    });
    decorator.googleMarker.addListener('click', () => {
      decorator.infoWindow.open(this.gmap, decorator.googleMarker);
    });
    decorator.unset = function unset() {
      this.googleMarker.setMap(null);
      this.googleMarker = null;
    };
    return decorator;
  }

}

export default MapView;
