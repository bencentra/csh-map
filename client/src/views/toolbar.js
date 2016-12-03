import Backbone from 'backbone';
import _ from 'underscore';
import MapEvents from '../events';
import toolbarTemplate from '../templates/toolbar.html';

/*
* View for the map's toolbar.
*
* Has buttons for:
* - Centering the map
* - Searching the map
* - Updating your location on the map
*/
class ToolbarView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      'click a.toolbar-center': '_onClickCenter',
      'click a.toolbar-search': '_onClickSearch',
      'click a.toolbar-info': '_onClickInfo',
    };
    this.template = _.template(toolbarTemplate);
  }

  render() {
    this.el.innerHTML = this.template();
    this.delegateEvents();
    return this;
  }

  _onClickCenter(e) {
    e.preventDefault();
    this._collapseNavbar();
    MapEvents.trigger('center');
  }

  _onClickSearch(e) {
    e.preventDefault();
    this._collapseNavbar();
    MapEvents.trigger('search');
  }

  _onClickInfo(e) {
    e.preventDefault();
    this._collapseNavbar();
    MapEvents.trigger('info');
  }

  // Collapse the navigation on mobile browsers
  _collapseNavbar() {
    this.$('.collapse').collapse('hide');
  }

}

export default ToolbarView;
