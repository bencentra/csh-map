import Backbone from 'backbone';
import _ from 'underscore';
import alertTemplate from '../templates/alert.html';

class AlertView extends Backbone.View {

  constructor(options) {
    super(options);
    this.template = _.template(alertTemplate);
    this.data = {};
  }

  render() {
    this.el.innerHTML = this.template(this.data);
    return this;
  }

  setData(type, message) {
    this.data = {
      type,
      message
    };
  }

}

export default AlertView;
