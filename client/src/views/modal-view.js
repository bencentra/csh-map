import Backbone from 'backbone';
import _ from 'underscore';
import template from '../templates/modal.html';

class ModalView extends Backbone.View {

  constructor(options) {
    super(options);
    this.title = options.title;
    this.template = _.template(template);
    this.events = {
      'click .submit-button': '_onSubmit',
      'click .close-button': '_onClose',
    };
    this.buttons = _.extend({}, options.buttons, {
      close: 'Close'
    });
  }

  render() {
    // const vars = _.extend({}, this.model.get('config'), data);
    this.$el.html(this.template({
      title: this.title,
      buttons: this.buttons,
    }));
    this.$('.modal-body').html(this.childView.render().$el);
    this.$modal = this.$('.modal');
    this.$modal.modal({ show: false });
    this.delegateEvents();
    return this;
  }

  show() {
    console.log('show');
    this.$modal.modal('show');
  }

  hide() {
    this.$modal.modal('hide');
  }

  toggle() {
    this.$modal.modal('toggle');
  }

  setChildView(childView) {
    this.childView = childView;
  }

  _onSubmit(e) {
    if (typeof this.childView.submit === 'function') {
      this.childView.submit(e);
    }
  }

  _onClose(e) {
    if (typeof this.childView.close === 'function') {
      this.childView.close(e);
    }
  }

}

export default ModalView;
