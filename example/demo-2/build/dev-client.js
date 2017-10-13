/* eslint-disable */
require('eventsource-polyfill');
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    console.log('hale is reloading');
    window.location.reload();
  }
});