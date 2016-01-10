import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import ModalView from './modal-view';
import infoModalTemplate from '../templates/info-modal.html';

class InfoView extends ModalView {

  constructor(options) {
    super(options);
    this.template = _.template(infoModalTemplate);
  }

}

export default InfoView;
