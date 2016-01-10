import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import AsyncCollection from './async-collection';
import MemberModel from '../models/member';

class MemberCollection extends AsyncCollection {

  constructor(options) {
    super(options);
    this.model = MemberModel;
    this.url = this.config.apiUrl + '/members';
  }

}

export default MemberCollection;
