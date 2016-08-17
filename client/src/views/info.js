import _ from 'underscore';
import Backbone from 'backbone';
import MapEvents from '../events';
// import ModalView from './modal-view';
import infoModalTemplate from '../templates/info-modal.html';

class InfoView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      'keyup input.city-input': '_onEditCity',
      'keyup input.state-input': '_onEditState',
      'keyup input.country-input': '_onEditCountry',
      'change select.reason-input': '_onEditReason',
      'click button.remove-button': '_onRemove',
    };
    this.template = _.template(infoModalTemplate);
    this.parentModal = options.parentModal;
    this.parentModal.setChildView(this);
  }

  render() {
    this.model.loadDataFromMap();
    const data = this.model.toJSON();
    this.$el.html(this.template(data));
    this.delegateEvents();
    return this;
  }

  submit(e) {
    this._onSubmit(e);
  }

  _onEditCity(event) {
    this._submitOrUpdate(event, 'city');
  }

  _onEditState(event) {
    this._submitOrUpdate(event, 'state');
  }

  _onEditCountry(event) {
    this._submitOrUpdate(event, 'country');
  }

  _onEditReason(event) {
    this.model.set('reason', parseInt(event.target.value, 10));
  }

  _submitOrUpdate(event, field) {
    if (event.which === 13) {
      this._onSubmit();
    } else {
      this.model.set(field, event.target.value);
    }
  }

  _onSubmit() {
    this.model.updateAddress()
      .then(this._onSubmitSuccess.bind(this))
      .catch(this._onError.bind(this))
      .done();
  }

  _onSubmitSuccess() {
    MapEvents.trigger('update');
    MapEvents.trigger('alert', 'success', 'Your location has been updated successfully.');
    // this.hide();
    this.parentModal.hide();
  }

  _onRemove() {
    this.model.removeFromMap()
      .then(this._onRemoveSuccess.bind(this))
      .catch(this._onError.bind(this))
      .done();
  }

  _onRemoveSuccess() {
    MapEvents.trigger('update');
    MapEvents.trigger('alert', 'success', 'You have been removed from the map.');
    // this.hide();
    this.parentModal.hide();
  }

  _onError(error) {
    MapEvents.trigger('alert', 'danger', error.toString());
    // this.hide();
    this.parentModal.hide();
  }

}

export default InfoView;
