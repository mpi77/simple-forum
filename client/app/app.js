'use strict';

require("jquery");
require("bootstrap");
require("angular");
require("angular-route");
require("./index/index.js");

angular.module('simpleForum', [
  'ngRoute',
  'simpleForum.index'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/index'});
}]);
