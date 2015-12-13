'use strict';

const GW_CREATE_THREAD_URL = "http://private-c7d92-pwx.apiary-mock.com/threads/";
const GW_LIST_THREADS_URL = "http://private-c7d92-pwx.apiary-mock.com/threads/";

angular.module('simpleForum.thread', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/thread', {
	templateUrl : 'components/thread/create.html',
	controller : 'ThreadCreateCtrl',
	css: ['components/thread/thread.css']
    });
    $routeProvider.when('/threads', {
	templateUrl : 'components/thread/list.html',
	controller : 'ThreadListCtrl',
	css: ['components/thread/thread.css']
    });
} ])

.controller('ThreadCreateCtrl', ['$scope','$location','$http','auth', function($scope,$location,$http,auth) {
    $scope.create = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadName = $scope.threadName;
	
	$http.post(GW_CREATE_THREAD_URL,
		JSON.stringify({'title':threadName})
	).then((res) => {
	    // success
	    console.log('create thread ok');
	    $location.path('/threads');
	    
	}, (res) => {
	    // fail
	    console.log('create thread fail');
	});

    };
    
}])

.controller('ThreadListCtrl', ['$scope','$location','$http','auth', function($scope,$location,$http,auth) {
    $scope.fetch = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$http.get(GW_LIST_THREADS_URL)
	.then((res) => {
	    // success
	    console.log('list threads ok');
	    $scope.threads = res.data.items;
	    
	}, (res) => {
	    // fail
	    console.log('list threads fail');
	    $scope.threads = null;
	});
	
    };
    
    $scope.fetch();
}]);