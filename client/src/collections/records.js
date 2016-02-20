import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import AsyncCollection from './async-collection';

class RecordCollection extends AsyncCollection {

  constructor(options) {
    super(options);
    this.name = 'RecordCollection';
    this.model = Backbone.Model;
    this.url = this.config.apiUrl + '/records';
  }

}

export default RecordCollection;
