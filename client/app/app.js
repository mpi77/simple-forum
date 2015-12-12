'use strict';

require("jquery");
require("bootstrap");
require("angular");
require("angular-route");

var home = require("./components/home/home.js");
var session = require("./components/session/session.js");
var thread = require("./components/thread/thread.js");
var message = require("./components/message/message.js");

angular.module('simpleForum', [
  'ngRoute',
  'simpleForum.home',
  'simpleForum.session',
  'simpleForum.thread',
  'simpleForum.message'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
