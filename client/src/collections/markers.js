var app = app || {};

(function(Backbone, _, $) {

  'use strict';

  var Markers = Backbone.Collection.extend({

    model: app.Marker,

    url: app.API_URL + '/markers'

  });

  app.markers = new Markers();

})(Backbone, _, jQuery);
