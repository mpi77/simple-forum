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

.controller('LoginCtrl', ['$scope','$location','auth', function($scope,$location,auth) {
    $scope.login = function(){
	auth.login($scope.username, $scope.password);
	$location.path('/home');
    };
    
}])

.controller('LogoutCtrl', ['$scope','auth', function(sc,auth) {
    auth.logout();
}]);