import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from '../config';
import LocationModel from '../models/location';

class LocationCollection extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.model = LocationModel;
    this.config = Config.getInstance();
    this.url = this.config.apiUrl + '/locations';
  }

  init() {
    let defer = $.Deferred();
    this.fetch({
      success: function() {
        defer.resolve();
      },
      error: function() {
        defer.reject();
      }
    });
    return defer.promise();
  }

}

export default LocationCollection;
