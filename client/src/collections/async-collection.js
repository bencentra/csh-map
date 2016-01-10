import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from '../config';

class AsyncCollection extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.config = Config.getInstance();
  }

  init() {
    let defer = $.Deferred();
    this.fetch({
      success: () => {
        defer.resolve();
      },
      error: () => {
        defer.reject();
      }
    });
    return defer.promise();
  }

}

export default AsyncCollection;
