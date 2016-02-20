import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import AsyncCollection from './async-collection';

class LocationCollection extends AsyncCollection {

  constructor(options) {
    super(options);
    this.name = 'LocationCollection';
    this.model = Backbone.Model;
    this.url = this.config.apiUrl + '/locations';
  }

}

export default LocationCollection;
