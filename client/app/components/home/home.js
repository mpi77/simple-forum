'use strict';

angular.module('simpleForum.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'components/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','auth', function($scope,auth) {
    $scope.lin = auth.isAuth();
}]);