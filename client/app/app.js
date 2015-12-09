'use strict';

angular.module('simpleForum', [
  'ngRoute',
  'simpleForum.index'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/index'});
}]);
