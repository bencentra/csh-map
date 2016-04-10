import Backbone from 'backbone';
import AsyncCollection from './async-collection';

class ReasonCollection extends AsyncCollection {

  constructor(options) {
    super(options);
    this.name = 'ReasonCollection';
    this.model = Backbone.Model;
    this.url = `${this.config.apiUrl}/reasons`;
  }

}

export default ReasonCollection;
