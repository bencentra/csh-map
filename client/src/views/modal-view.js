import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

class ModalView extends Backbone.View {

  constructor(options) {
    super(options);
    this.config = options.config;
  }

  render() {
    this.el.innerHTML = this.template(this.config);
    this.$modal = this.$('.modal');
    this.$modal.modal({show: false});
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
