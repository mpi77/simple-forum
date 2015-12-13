'use strict';

angular.module('simpleForum.thread', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/thread', {
	templateUrl : 'components/thread/create.html',
	controller : 'ThreadCreateCtrl'
    });
    $routeProvider.when('/threads', {
	templateUrl : 'components/thread/list.html',
	controller : 'ThreadListCtrl'
    });
} ])

.controller('ThreadCreateCtrl', [ function() {

} ])
.controller('ThreadListCtrl', [ function() {

} ]);