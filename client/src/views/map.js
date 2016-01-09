import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import mapTemplate from '../templates/map.html';

class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    console.log('Creating new MapView');
    console.log(options);
    this.el = document.querySelector('#csh-map');
    this.template = _.template(mapTemplate);
  }

  render() {
    let data = this.model.toJSON();
    this.el.innerHTML = this.template(data);
    return this;
  }

}

export default MapView;
