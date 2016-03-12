import _ from 'underscore';
import MapEvents from '../events';
import ModalView from './modal-view';
import infoModalTemplate from '../templates/info-modal.html';

class InfoView extends ModalView {

  constructor(options) {
    super(options);
    this.events = {
      'keyup input.city-input': '_onEditCity',
      'keyup input.state-input': '_onEditState',
      'keyup input.country-input': '_onEditCountry',
      'click button.submit-button': '_onClickUpdate',
      'click button.remove-button': '_onClickRemove'
    };
    this.template = _.template(infoModalTemplate);
  }

  render() {
    this.model.loadDataFromMap();
    const data = this.model.toJSON();
    super.render(data);
    return this;
  }

  _onEditCity(e) {
    this.model.set('city', e.target.value);
  }

  _onEditState(e) {
    this.model.set('state', e.target.value);
  }

  _onEditCountry(e) {
    this.model.set('country', e.target.value);
  }

  _onClickUpdate() {
    this.model.updateAddress()
      .then(this._onUpdateSuccess.bind(this))
      .catch(this._onError.bind(this))
      .done();
  }

  _onUpdateSuccess() {
    MapEvents.trigger('update');
    MapEvents.trigger('alert', 'success', 'Your location has been updated successfully.');
    this.hide();
  }

  _onClickRemove() {
    this.model.removeFromMap()
      .then(this._onRemoveSuccess.bind(this))
      .catch(this._onError.bind(this))
      .done();
  }

  _onRemoveSuccess() {
    MapEvents.trigger('update');
    MapEvents.trigger('alert', 'success', 'You have been removed from the map.');
    this.hide();
  }

  _onError(error) {
    MapEvents.trigger('alert', 'danger', error.toString());
    this.hide();
  }

}

export default InfoView;
