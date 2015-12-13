'use strict';

angular.module('simpleForum.session', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'components/session/login.html',
    controller: 'LoginCtrl',
    css: ['components/session/session.css']
  });
  $routeProvider.when('/logout', {
      templateUrl: 'components/session/logout.html',
      controller: 'LogoutCtrl',
      css: ['components/session/session.css']
    });
}])

.controller('LoginCtrl', ['$scope','$location','auth', function($scope,$location,auth) {
    $scope.login = function(){
	auth.login($scope.username, $scope.password, ()=>{
	    $location.path('/home');
	});
    };
    
}])

.controller('LogoutCtrl', ['$scope','$location','auth', function($scope,$location,auth) {
    auth.logout(()=>{
	//$location.path('/home');
    });
}]);