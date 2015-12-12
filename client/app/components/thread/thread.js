'use strict';

angular.module('simpleForum.thread', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/thread', {
    templateUrl: 'components/thread/create.html',
    controller: 'CreateThreadCtrl'
  });
}])

.controller('CreateThreadCtrl', [function() {

}]);