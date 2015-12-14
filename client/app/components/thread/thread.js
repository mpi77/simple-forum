'use strict';

const GW_CREATE_THREAD_URL = "http://private-c7d92-pwx.apiary-mock.com/threads/";
const GW_THREAD_MESSAGES_URL = "http://private-c7d92-pwx.apiary-mock.com/messages/";
const GW_DELETE_THREAD_URL = "http://private-c7d92-pwx.apiary-mock.com/threads/";
const GW_LIST_THREADS_URL = "http://private-c7d92-pwx.apiary-mock.com/threads/";

angular.module('simpleForum.thread', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/thread', {
	templateUrl : 'components/thread/create.html',
	controller : 'ThreadCreateCtrl',
	css: ['components/thread/thread.css']
    });
    $routeProvider.when('/thread/:threadId', {
	templateUrl : 'components/thread/view.html',
	controller : 'ThreadViewCtrl',
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
    
    $scope.back = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/threads');
    };
}])

.controller('ThreadViewCtrl', ['$scope','$location','$http','$routeParams','auth', function($scope,$location,$http,$routeParams,auth) {
    $scope.fetch = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$http.get(GW_THREAD_MESSAGES_URL + '?q=(thread=' + $routeParams.threadId + ')')
	.then((res) => {
	    // success
	    console.log('view thread ok');
	    $scope.content = res.data.items;
	}, (res) => {
	    // fail
	    console.log('view thread fail');
	    $scope.threads = null;
	});
    };
    
    $scope.createMessage = function(threadId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.url('/message').search({thread:threadId});
    };
    
    $scope.removeMessage = function(messageId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	console.log('remove message ok');
    };
    
    $scope.removeThread = function(threadId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	console.log('remove thread ok');
    };
    
    $scope.back = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/threads');
    };
    
    $scope.fetch();
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
    
    $scope.remove = function(threadId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$http.delete(GW_DELETE_THREAD_URL + threadId + '/')
	.then((res) => {
	    // success
	    console.log('delete thread ok');
	    $location.path('/threads');
	    $scope.fetch();
	}, (res) => {
	    // fail
	    console.log('delete thread fail');
	});
    };
    
    $scope.messages = function(threadId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/thread/'+threadId+'/');
    };
    
    $scope.createThread = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/thread');
    };
    
    $scope.fetch();
}]);