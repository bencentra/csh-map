import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import mapTemplate from '../templates/map.html';

class MapView extends Backbone.View {

  constructor() {
    super();
    this.$el = $('#csh-map');
    console.log(mapTemplate);
    this.template = _.template(mapTemplate);
  }

  render() {
    this.$el.html(this.template({name: 'Ben'}));
    return this;
  }

}

export default MapView;
