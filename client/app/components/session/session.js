'use strict';

angular.module('simpleForum.session', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'components/session/login.html',
    controller: 'LoginCtrl'
  });
  $routeProvider.when('/logout', {
      templateUrl: 'components/session/logout.html',
      controller: 'LogoutCtrl'
    });
}])

.controller('LoginCtrl', [function() {

}])

.controller('LogoutCtrl', [function() {

}]);