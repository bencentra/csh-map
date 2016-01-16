import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import MapEvents from '../events';
import toolbarTemplate from '../templates/toolbar.html';

class ToolbarView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      'click a.toolbar-search': '_onClickSearch',
      'click a.toolbar-info': '_onClickInfo'
    };
    this.template = _.template(toolbarTemplate);
  }

  render() {
    this.el.innerHTML = this.template();
    this.delegateEvents();
    return this;
  }

  _onClickSearch(e) {
    e.preventDefault();
    MapEvents.trigger('search');
  }

  _onClickInfo(e) {
    e.preventDefault();
    MapEvents.trigger('info');
  }

}

export default ToolbarView;
