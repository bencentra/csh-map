import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Q from 'q';
import Config from '../config';

class AsyncCollection extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.config = Config.getInstance();
  }

  init() {
    let defer = Q.defer();
    this.reset();
    this.fetch()
      .success(response => {
        defer.resolve();
      })
      .error(error => {
        defer.reject(new Error('Unable to fetch data for ' + this.name + ': ' + error));
      });
    return defer.promise;
  }

  addAndSync(model, options) {
    let newModel = this.add(model, options);
    let defer = Q.defer();
    Backbone.sync('create', newModel)
      .success(response => {
        defer.resolve(newModel);
      }).error(error => {
        defer.reject(error);
      });
    return defer.promise;
  }

}

export default AsyncCollection;
