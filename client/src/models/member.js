var app = app || {};

(function(Backbone, _, $) {

  'use strict';

  app.Member = Backbone.Model.extend({

    defaults: {
      uid: '',
      cn: '',
      canEmail: false,
      markerId: 0,
      updatedAt: null
    }

  });

})(Backbone, _, jQuery);
