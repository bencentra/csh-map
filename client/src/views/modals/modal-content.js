import Backbone from 'backbone';

/*
* View for the contents of a ModalView.
*
* It knows about its parent Modal, but that's about it.
*/
class ModalContentView extends Backbone.View {

  constructor(options) {
    super(options);
    this.parentModal = options.parentModal;
    this.parentModal.setContentView(this);
  }

  render() {
    this.$el.html('Modal Content');
    return this;
  }

  // Handler for a Submit button click. Override me!
  submit() {

  }

  // Handler for a Close button click. Override me!
  close() {

  }

}

export default ModalContentView;
