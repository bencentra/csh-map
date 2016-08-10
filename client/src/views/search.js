import _ from 'underscore';
import ModalView from './modal-view';
import SearchResultsView from './search-results';
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
    this.resultsView = new SearchResultsView();
    this.searchTimeout = null;
  }

  render() {
    const data = this.model.toJSON();
    super.render(data);
    this.$el.find('#csh-map-search-results').html(this.resultsView.render().el);
    this._showResults();
    return this;
  }

  _changeType(e) {
    const $target = $(e.target);
    const type = $target.data('value');
    this.model.set('activeType', type);
    this.$('.csh-map-search-type-btn').removeClass('btn-primary').addClass('btn-default');
    $target.removeClass('btn-default').addClass('btn-primary');
    // TODO: This view also needs to be a child view of the Modal to re-render properly
    // this.render();
    this._search($('#csh-map-search-input').val());
  }

  _debounceSearch(e) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this._search($(e.target).val()), 200);
  }

  _search(query) {
    const results = this.model.search(query);
    this._showResults(results);
  }

  _showResults(results = []) {
    this.resultsView.setResults(results);
    this.resultsView.render();
  }

}

export default SearchView;
