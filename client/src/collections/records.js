import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import AsyncCollection from './async-collection';
import RecordModel from '../models/record';

class RecordCollection extends AsyncCollection {

  constructor(options) {
    super(options);
    this.name = 'RecordCollection';
    this.model = RecordModel;
    this.url = this.config.apiUrl + '/records/present';
  }

}

export default RecordCollection;
