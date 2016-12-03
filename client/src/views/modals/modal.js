import Backbone from 'backbone';
import _ from 'underscore';
import template from '../../templates/modal.html';

/*
* View for creating a Bootstrap modal.
*
* This class is the modal itself. It must be given a child ModalContentView.
*/
class ModalView extends Backbone.View {

  constructor(options = {}) {
    super(options);
    // The title of the modal, displayed in the header
    this.title = options.title || 'Modal';
    this.template = _.template(template);
    this.events = {
      'click .submit-button': '_onSubmit',
      'click .close-button': '_onClose',
    };
    // By default only show a Close button. You can add a "Submit" button via options.
    this.buttons = _.extend({}, options.buttons, {
      close: 'Close',
    });
  }

  render() {
    // Render the modal wrapper
    this.$el.html(this.template({
      title: this.title,
      buttons: this.buttons,
    }));
    // Render the modal content
    this.$('.modal-body').html(this.contentView.render().$el);
    // Initialize the modal plugin
    this.$modal = this.$('.modal');
    this.$modal.modal({ show: false });
    this.delegateEvents();
    return this;
  }

  // Show the modal
  show() {
    this.$modal.modal('show');
  }

  // Hide the modal
  hide() {
    this.$modal.modal('hide');
  }

  // Toggle the modal's visibility
  toggle() {
    this.$modal.modal('toggle');
  }

  // Set the child ModalContentView
  setContentView(contentView) {
    this.contentView = contentView;
  }

  // Call the child view's submit button handler
  _onSubmit(e) {
    this.contentView.submit(e);
  }

  // Call the child view's close button handler
  _onClose(e) {
    this.contentView.close(e);
  }

}

export default ModalView;
