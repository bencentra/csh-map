import _ from 'underscore';
import ModalView from './modal-view';
import searchModalTemplate from '../templates/search-modal.html';

class SearchView extends ModalView {

  constructor(options) {
    _.extend(options, {
      events: {
        'click .csh-map-search-type-btn': '_changeType',
        'keyup #csh-map-search-input': '_debounceSearch',
      },
    });
    super(options);
    this.template = _.template(searchModalTemplate);
    this.searchTimeout = null;
  }

  render() {
    const data = this.model.toJSON();
    super.render(data);
    this._showResults();
    return this;
  }

  _changeType(e) {
    const $target = $(e.target);
    const type = $target.data('value');
    this.$('.csh-map-search-type-btn').removeClass('btn-primary').addClass('btn-default');
    $target.removeClass('btn-default').addClass('btn-primary');
    this.model.set('type', type);
    this._showResults();
  }

  _debounceSearch(e) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this._search(e), 200);
  }

  _search(e) {
    const query = $(e.target).val();
    const results = this.model.search(query);
    this._showResults(results);
  }

  // TODO: Make $results it's own sub-view
  _showResults(results = []) {
    const $results = this.$('#csh-map-search-results');
    $results.html('');
    if (results.length > 0) {
      results.forEach(result => {
        $results.append(`<div class="result">${result}</div>`);
      });
    } else {
      $results.html('<div class="no-result">No results found</div>');
    }
  }

}

export default SearchView;
