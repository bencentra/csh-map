import Backbone from 'backbone';
import _ from 'underscore';
import MapEvents from '../../events';
import searchResultsTemplate from '../../templates/search-results.html';

class SearchResultsView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      'click a.result': '_handleClick',
    };
    this.template = _.template(searchResultsTemplate);
    this.results = [];
  }

  render() {
    this.$el.html(this.template({
      results: this.results,
    }));
    this.delegateEvents();
    return this;
  }

  setResults(results) {
    this.results = results;
  }

  _handleClick(e) {
    const index = $(e.target).data('id');
    const marker = this.results[index].marker;
    MapEvents.trigger('search-result', marker);
  }

}

export default SearchResultsView;
