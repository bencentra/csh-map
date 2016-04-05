import Backbone from 'backbone';
import AsyncCollection from './async-collection';

class MemberCollection extends AsyncCollection {

  constructor(options) {
    super(options);
    this.name = 'MemberCollection';
    this.model = Backbone.Model;
    this.url = `${this.config.apiUrl}/members`;
  }

}

export default MemberCollection;
