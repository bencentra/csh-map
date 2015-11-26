var app = app || {};

(function(Backbone, _, $) {

  'use strict';

  var Users = Backbone.Collection.extend({

    model: app.User,

    url: app.API_URL + '/users'

  });

  app.users = new Users();

})(Backbone, _, jQuery);
