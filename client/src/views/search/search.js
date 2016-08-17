import _ from 'underscore';
import ModalContentView from '../modals/modal-content';
import SearchResultsView from './search-results';
import searchModalTemplate from '../../templates/search-modal.html';

class SearchView extends ModalContentView {

  constructor(options) {
    super(options);
    this.events = {
      'click .csh-map-search-type-btn': '_changeType',
      'keyup #csh-map-search-input': '_debounceSearch',
    };
    this.template = _.template(searchModalTemplate);
    this.resultsView = new SearchResultsView();
    this.searchTimeout = null;
  }

  render() {
    const data = this.model.toJSON();
    this.$el.html(this.template(data));
    this.$('#csh-map-search-results').html(this.resultsView.render().el);
    this._showResults();
    this.delegateEvents();
    return this;
  }

  close() {
    this.model.set('query', '');
  }

  _changeType(e) {
    const $target = $(e.target);
    const type = $target.data('value');
    this.model.set('activeType', type);
    this.render();
    this._search();
  }

  _debounceSearch(e) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.model.set('query', $(e.target).val());
      this._search();
    }, 200);
  }

  _search() {
    const results = this.model.search();
    this._showResults(results);
  }

  _showResults(results = []) {
    this.resultsView.setResults(results);
    this.resultsView.render();
  }

}

export default SearchView;
