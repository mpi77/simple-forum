'use strict';

angular.module('simpleForum.message', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/message', {
    templateUrl: 'components/message/create.html',
    controller: 'CreateMessageCtrl'
  });
}])

.controller('CreateMessageCtrl', [function() {

}]);