import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import AsyncCollection from './async-collection';
import LocationModel from '../models/location';

class LocationCollection extends AsyncCollection {

  constructor(options) {
    super(options);
    this.model = LocationModel;
    this.url = this.config.apiUrl + '/locations';
  }

}

export default LocationCollection;
