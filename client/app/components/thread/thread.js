'use strict';

const GW_CREATE_THREAD_URL = "http://private-c7d92-pwx.apiary-mock.com/threads/";
const GW_THREAD_MESSAGES_URL = "http://private-c7d92-pwx.apiary-mock.com/messages/";
const GW_THREAD_MEMBERS_URL = "http://private-c7d92-pwx.apiary-mock.com/threadMembers/";
const GW_DELETE_THREAD_URL = "http://private-c7d92-pwx.apiary-mock.com/threads/";
const GW_DELETE_MESSAGE_URL = "http://private-c7d92-pwx.apiary-mock.com/messages/";
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

.controller('ThreadCreateCtrl', ['$scope','$location','$http','Flash','auth', function($scope,$location,$http,Flash,auth) {
    $scope.create = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadName = $scope.threadName;
	
	$http.post(GW_CREATE_THREAD_URL,
		JSON.stringify({'title':threadName})
	).then((res) => {
	    // success
	    Flash.create('success', '<strong>Well done!</strong> You successfully created new thread.');
	    $location.path('/threads');
	}, (res) => {
	    // fail
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] create/thread create');
	});
    };
    
    $scope.back = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/threads');
    };
}])

.controller('ThreadViewCtrl', ['$scope','$location','$http','$routeParams','Flash','auth', function($scope,$location,$http,$routeParams,Flash,auth) {
    $scope.fetch = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$http.get(GW_THREAD_MESSAGES_URL + '?q=(thread=' + $routeParams.threadId + ')')
	.then((res) => {
	    // success
	    $scope.content = res.data.items;
	}, (res) => {
	    // fail
	    $scope.threads = null;
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] view/thread view');
	});
    };
    
    $scope.createMessage = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadId = $routeParams.threadId;
	$location.url('/message').search({thread:threadId});
    };
    
    $scope.threadMembers = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadId = $routeParams.threadId;
	$http.get(GW_THREAD_MEMBERS_URL + '?q=(thread=' + threadId + ')')
	.then((res) => {
	    // success
	    $scope.thMembers = res.data.items;
	}, (res) => {
	    // fail
	    $scope.thMembers = null;
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] view/thread members');
	});
    };
    
    $scope.removeMessage = function(messageId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadId = $routeParams.threadId;
	$http.delete(GW_DELETE_MESSAGE_URL + messageId + '/')
	.then((res) => {
	    // success
	    Flash.create('success', '<strong>Well done!</strong> You successfully removed message.');
	    $location.path('/thread/' + threadId);
	    $scope.fetch();
	}, (res) => {
	    // fail
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] view/message remove');
	});
    };
    
    $scope.removeThread = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadId = $routeParams.threadId;
	$http.delete(GW_DELETE_THREAD_URL + threadId + '/')
	.then((res) => {
	    // success
	    Flash.create('success', '<strong>Well done!</strong> You successfully removed thread.');
	    $location.path('/threads');
	    $scope.fetch();
	}, (res) => {
	    // fail
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] view/thread remove');
	});
    };
    
    $scope.back = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/threads');
    };
    
    $scope.fetch();
}])

.controller('ThreadListCtrl', ['$scope','$location','$http','Flash','auth', function($scope,$location,$http,Flash,auth) {
    $scope.fetch = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$http.get(GW_LIST_THREADS_URL)
	.then((res) => {
	    // success
	    $scope.threads = res.data.items;
	}, (res) => {
	    // fail
	    $scope.threads = null;
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] threads/list of threads');
	});
    };
    
    $scope.remove = function(threadId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$http.delete(GW_DELETE_THREAD_URL + threadId + '/')
	.then((res) => {
	    // success
	    Flash.create('success', '<strong>Well done!</strong> You successfully removed thread.');
	    $location.path('/threads');
	    $scope.fetch();
	}, (res) => {
	    // fail
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] threads/thread remove');
	});
    };
    
    $scope.messages = function(threadId){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/thread/'+threadId);
    };
    
    $scope.createThread = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	$location.path('/thread');
    };
    
    $scope.fetch();
}]);