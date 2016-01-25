import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

class ModalView extends Backbone.View {

  constructor(options) {
    super(options);
    this.model = options.model;
  }

  render(data) {
    let vars = _.extend({}, this.model.get('config'), data);
    this.el.innerHTML = this.template(vars);
    this.$modal = this.$('.modal');
    this.$modal.modal({show: false});
    this.delegateEvents();
    return this;
  }

  show() {
    this.$modal.modal('show');
  }

  hide() {
    this.$modal.modal('hide');
  }

  toggle() {
    this.$modal.modal('toggle');
  }

}

export default ModalView;