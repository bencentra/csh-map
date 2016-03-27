import MapView from '../../src/views/map';
import Backbone from 'backbone';

describe('MapView', () => {

  let mapView = null;
  const mockModel = new Backbone.Model({
    markers: {
      1: {
        location: {
          address: 'Boston, MA, USA',
          latitude: 12,
          longitude: 34
        },
        members: [
          {cn: 'Ben Centra', uid: 'bencentra'}
        ]
      }
    }
  });

  beforeEach(() => {
    mapView = new MapView({model: mockModel});
  });

  it('can be constructed', () => {
    expect(mapView).toBeDefined();
    expect(mapView.gmapOptions).toBeDefined();
    expect(mapView.gmap).toEqual(null);
    expect(mapView._infoWindowTemplate).toBeDefined();
  });

  describe('render()', () => {

    beforeEach(() => {
      spyOn(mapView, 'delegateEvents').and.callThrough();
    });

    it('creates the Google Map', () => {
      mapView.render();
      expect(mapView.gmap).toBeDefined();
      expect(mapView.gmap.spy).toHaveBeenCalledWith(mapView.el, mapView.gmapOptions);
      expect(mapView.delegateEvents).toHaveBeenCalled();
    });

    it('does not create the Google Map if it is already defined', () => {
      mapView.gmap = new google.maps.Map(mapView.el, mapView.gmapOptions);
      expect(mapView.gmap.spy).toHaveBeenCalledWith(mapView.el, mapView.gmapOptions);
      mapView.gmap.spy.calls.reset();
      mapView.render();
      expect(mapView.gmap.spy).not.toHaveBeenCalled();
    });

    it('decorates the model\'s markers', () => {
      mapView.render();
      const markers = mapView.model.get('markers');
      const firstMarker = markers['1'];
      expect(firstMarker.googleMarker).toBeDefined();
      expect(firstMarker.infoWindow).toBeDefined();
      expect(firstMarker.unset).toBeDefined();
    });

  });

});
