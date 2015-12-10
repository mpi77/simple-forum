'use strict';

angular.module('simpleForum.access', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/access', {
    templateUrl: 'access/access.html',
    controller: 'AccessCtrl'
  });
}])

.controller('AccessCtrl', [function() {

}]);