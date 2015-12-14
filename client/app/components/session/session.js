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

.controller('LoginCtrl', ['$scope','$location','Flash','auth', function($scope,$location,Flash,auth) {
    $scope.login = function(){
	auth.login($scope.username, $scope.password, ()=>{
	    Flash.create('success', '<strong>Well done!</strong> You are logged in.');
	    $location.path('/home');
	});
    };
    
}])

.controller('LogoutCtrl', ['$scope','$location','Flash','auth', function($scope,$location,Flash,auth) {
    auth.logout(()=>{
	Flash.create('info', 'You are logged out.');
    });
}]);