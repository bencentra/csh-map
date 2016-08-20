import Backbone from 'backbone';
import _ from 'underscore';
import MapEvents from '../events';
import toolbarTemplate from '../templates/toolbar.html';

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

  _collapseNavbar() {
    this.$('.collapse').collapse('hide');
  }

}

export default ToolbarView;
