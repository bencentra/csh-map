import Backbone from 'backbone';
import Q from 'q';
import Config from '../config';

class AsyncCollection extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.config = Config.getInstance();
  }

  init() {
    const defer = Q.defer();
    this.fetch()
      .success(() => {
        defer.resolve();
      })
      .error(error => {
        defer.reject(new Error(`Unable to fetch data for ${this.name}: ${error}`));
      });
    return defer.promise;
  }

  addAndSync(method, model, options) {
    const newModel = this.add(model, options);
    const defer = Q.defer();
    Backbone.sync(method, newModel)
      .success(() => {
        defer.resolve(newModel);
      }).error(error => {
        defer.reject(error);
      });
    return defer.promise;
  }

}

export default AsyncCollection;
