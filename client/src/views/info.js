import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import MapEvents from '../events';
import ModalView from './modal-view';
import infoModalTemplate from '../templates/info-modal.html';

const SELECTORS = {
  CITY: '#csh-map-info-city',
  STATE: '#csh-map-info-state',
  COUNTRY: '#csh-map-info-country'
};

class InfoView extends ModalView {

  constructor(options) {
    super(options);
    this.events = {
      'click button.submit-button': '_onClickUpdate',
      'click button.remove-button': '_onClickRemove'
    };
    this.template = _.template(infoModalTemplate);
  }

  render() {
    super.render();
    let address = this.model.getAddress();
    if (address) {
      address = address.split(', ');
      this.$(SELECTORS.CITY).val(address[0] || '');
      this.$(SELECTORS.STATE).val(address[1] || '');
      this.$(SELECTORS.COUNTRY).val(address[2] || 'USA');
    }
    return this;
  }

  _onClickUpdate(e) {
    let address = {
      city: this.$(SELECTORS.CITY).val(),
      state: this.$(SELECTORS.STATE).val(),
      country: this.$(SELECTORS.COUNTRY).val()
    };
    this.model.updateAddress(address)
      .then(this._onUpdateSuccess.bind(this))
      .catch(this._onUpdateError.bind(this))
      .done();
  }

  _onUpdateSuccess() {
    MapEvents.trigger('info-updated');
    this.hide();
  }

  _onUpdateError(error) {
    console.error(error);
  }

  _onClickRemove(e) {
    this.model.removeFromMap()
      .then(this._onRemoveSuccess.bind(this))
      .catch(this._onRemoveError.bind(this))
      .done();
  }

  _onRemoveSuccess(result) {
    console.log(result);
  }

  _onRemoveError(error) {
    console.error(error);
  }

}

export default InfoView;
