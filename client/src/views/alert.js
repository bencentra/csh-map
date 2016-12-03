import Backbone from 'backbone';
import _ from 'underscore';
import alertTemplate from '../templates/alert.html';

/*
* View for the alert message that shows when updating info.
*/
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

  // Set the type (success/failure) and message of the alert
  setData(type, message) {
    this.data = {
      type,
      message,
    };
  }

}

export default AlertView;
