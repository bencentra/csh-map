import Backbone from 'backbone';
import _ from 'underscore';
import MapEvents from '../../events';
import searchResultsTemplate from '../../templates/search-results.html';

/*
* View for the results of a Search.
*
* I didn't want to use jQuery UI's autocomplete, so I wrote this myself.
*/
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

  // Set the search results from the model
  setResults(results) {
    this.results = results;
  }

  // Center the map on the selected search result marker
  _handleClick(e) {
    const index = $(e.target).data('id');
    const marker = this.results[index].marker;
    MapEvents.trigger('search-result', marker);
  }

}

export default SearchResultsView;
