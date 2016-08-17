import Backbone from 'backbone';

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

  submit() {

  }

  close() {

  }

}

export default ModalContentView;
