import _ from 'underscore';
import SearchModel from '../models/search';
import ModalView from './modal-view';
import searchModalTemplate from '../templates/search-modal.html';

class SearchView extends ModalView {

  constructor(options) {
    _.extend(options, {
      events: {
        'click .csh-map-search-type-btn': '_changeType',
        'keyup #csh-map-search-input': '_search',
      },
    });
    super(options);
    this.template = _.template(searchModalTemplate);
  }

  render() {
    const data = this.model.toJSON();
    super.render(data);
    return this;
  }

  _changeType(e) {
    const $target = $(e.target);
    const type = $target.data('value');
    this.$('.csh-map-search-type-btn')
      .removeClass('btn-primary')
      .addClass('btn-default');
    $target.removeClass('btn-default').addClass('btn-primary');
    this.model.set('type', type);
  }

  _search(e) {
    const query = $(e.target).val();
    console.log(query);
    console.log(e);
  }

}

export default SearchView;
