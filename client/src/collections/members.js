import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Config from '../config';
import MemberModel from '../models/member';

class MemberCollection extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.model = MemberModel;
    this.config = Config.getInstance();
    this.url = this.config.apiUrl + '/members';
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

export default MemberCollection;
