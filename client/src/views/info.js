import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import MapEvents from '../events';
import ModalView from './modal-view';
import infoModalTemplate from '../templates/info-modal.html';

const SELECTORS = {
  CITY: '.city-input',
  STATE: '.state-input',
  COUNTRY: '.country-input'
};

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
    let data = this.model.toJSON();
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

  _onClickUpdate(e) {
    this.model.updateAddress()
      .then(this._onUpdateSuccess.bind(this))
      .catch(this._onUpdateError.bind(this))
      .done();
  }

  _onUpdateSuccess(result) {
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
    MapEvents.trigger('info-removed');
    this.hide();
  }

  _onRemoveError(error) {
    console.error(error);
  }

}

export default InfoView;
