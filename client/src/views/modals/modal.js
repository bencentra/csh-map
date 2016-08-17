import Backbone from 'backbone';
import _ from 'underscore';
import template from '../../templates/modal.html';

class ModalView extends Backbone.View {

  constructor(options = {}) {
    super(options);
    this.title = options.title || 'Modal';
    this.template = _.template(template);
    this.events = {
      'click .submit-button': '_onSubmit',
      'click .close-button': '_onClose',
    };
    this.buttons = _.extend({}, options.buttons, {
      close: 'Close',
    });
  }

  render() {
    this.$el.html(this.template({
      title: this.title,
      buttons: this.buttons,
    }));
    this.$('.modal-body').html(this.contentView.render().$el);
    this.$modal = this.$('.modal');
    this.$modal.modal({ show: false });
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

  setContentView(contentView) {
    this.contentView = contentView;
  }

  _onSubmit(e) {
    this.contentView.submit(e);
  }

  _onClose(e) {
    this.contentView.close(e);
  }

}

export default ModalView;
