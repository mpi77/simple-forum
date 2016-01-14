'use strict';

const GW_CREATE_THREAD_URL = "https://api.sf.sd2.cz/threads/";
const GW_THREAD_MESSAGES_URL = "https://api.sf.sd2.cz/messages/";
const GW_THREAD_MEMBERS_URL = "https://api.sf.sd2.cz/threadMembers/";
const GW_DELETE_THREAD_URL = "https://api.sf.sd2.cz/threads/";
const GW_DELETE_MESSAGE_URL = "https://api.sf.sd2.cz/messages/";
const GW_LIST_THREADS_URL = "https://api.sf.sd2.cz/threads/";
const GW_THREAD_URL = "https://api.sf.sd2.cz/threads/";

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
			if(res.status == 201){
				Flash.create('success', '<strong>Well done!</strong> You successfully created new thread.');
			} else{
				Flash.create('danger', '<strong>Oooops!</strong> Some error occurred. Try it again.');
			}
		    
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
		
		$http.get(GW_THREAD_MESSAGES_URL + '?q=(threadId=' + $routeParams.threadId + ')&e=(message)&s=(tsCreate:desc)')
		.then((res) => {
		    // success
			if(res.status == 204){
				Flash.create('info', 'This thread does not contain any message.');
			}
			if(res != null && res.data != null){
				$scope.content = res.data.items;
			}
		}, (res) => {
		    // fail
		    $scope.threads = null;
		    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
		    console.log('[FAIL] view/thread view');
		});
		
		$http.get(GW_THREAD_URL + $routeParams.threadId + '/')
		.then((res) => {
		    // success
			if(res != null && res.data != null){
				$scope.thread = res.data;
			}
		}, (res) => {
		    // fail
		    $scope.thread = null;
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
    
    $scope.isOwner = function(x){
    	return (x == auth.getUser().username);
    };
    
    $scope.isOwnerXY = function(x,y){
    	return (x == y);
    };
    
    $scope.threadMembers = function(){
		if(!auth.isAuth()){
		    $location.path('/login');
		}
		
		let threadId = $routeParams.threadId;
		$http.get(GW_THREAD_MEMBERS_URL + '?q=(threadId=' + threadId + ')&e=(threadMember)')
		.then((res) => {
		    // success
			if(res != null && res.data != null){
				$scope.thMembers = res.data.items;
			}
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
			if(res.status == 200){
				Flash.create('success', '<strong>Well done!</strong> You successfully removed message.');
			} else{
				Flash.create('danger', '<strong>Oooops!</strong> Some error occurred. Try it again.');
			}
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
			if(res.status == 200){
				Flash.create('success', '<strong>Well done!</strong> You successfully removed thread.');
			} else{
				Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
			}
		    $location.path('/threads');
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
		
		$http.get(GW_LIST_THREADS_URL + '?e=(thread)')
		.then((res) => {
		    // success
			if(res.status == 204){
				Flash.create('info', 'We have not any thread. Please create a new one.');
			}
			if(res != null && res.data != null){
				$scope.threads = res.data.items;
			}
		}, (res) => {
		    // fail
		    $scope.threads = null;
		    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
		    console.log('[FAIL] threads/list of threads');
		});
    };
    
    $scope.isOwner = function(x){
    	return (x == auth.getUser().username);
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