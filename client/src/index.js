import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import MapView from './views/map';

console.log("Hello, World");
console.log(Backbone);
console.log(_);
console.log($);

class CSHMap {

  constructor() {

  }

  init() {
    let map = new MapView();
    map.render();
  }

}

window.CSHMap = CSHMap;
// export default CSHMap;
