import Backbone from 'backbone';
import _ from 'underscore';
import searchResultsTemplate from '../templates/search-results.html';

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
    console.log(e);
  }

}

export default SearchResultsView;
