import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import MapEvents from '../events';
import toolbarTemplate from '../templates/toolbar.html';

class ToolbarView extends Backbone.View {

  constructor(options) {
    super(options);
    console.log('Creating new ToolbarView');
    this.events = {
      'click a.toolbar-search': '_openSearchModal',
      'click a.toolbar-info': '_openInfoModal'
    };
    this.template = _.template(toolbarTemplate);
  }

  render() {
    console.log('ToolbarView render()');
    this.el.innerHTML = this.template();
    return this;
  }

  _openSearchModal(e) {
    e.preventDefault();
    console.log('_openSearchModal()');
    MapEvents.trigger('search');
  }

  _openInfoModal(e) {
    e.preventDefault();
    console.log('_openInfoModal()');
    MapEvents.trigger('info');
  }

}

export default ToolbarView;
