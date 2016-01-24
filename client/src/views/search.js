import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import ModalView from './modal-view';
import searchModalTemplate from '../templates/search-modal.html';

class SearchView extends ModalView {

  constructor(options) {
    super(options);
    this.events = {
      'click button.submit-button': '_onClickSearch'
    };
    this.template = _.template(searchModalTemplate);
  }

  _onClickSearch(e) {
    
  }

}

export default SearchView;
