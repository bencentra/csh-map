var app = app || {};

(function(Backbone, _, $) {

  'use strict';

  app.Marker = Backbone.Model.extend({

    defaults: {
      address: '',
      latitude: 0,
      longitude: 0,
      updatedAt: null
    }

  });

})(Backbone, _, jQuery);
