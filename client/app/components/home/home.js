'use strict';

angular.module('simpleForum.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'components/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','auth', function(sc,auth) {
    sc.xxx = "demo";
    //console.log(auth.login({username:"x", password:"y"}));
    //console.log(auth.isAuth());
}]);