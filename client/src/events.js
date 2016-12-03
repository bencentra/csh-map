import Backbone from 'backbone';
import _ from 'underscore';

/*
* Shared event channel for the application
*/
const MapEvents = _.extend({}, Backbone.Events);

export default MapEvents;
