'use strict';

const GW_CREATE_MESSAGE_URL = "http://private-c7d92-pwx.apiary-mock.com/messages/";

angular.module('simpleForum.message', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/message', {
    templateUrl: 'components/message/create.html',
    controller: 'MessageCreateCtrl',
    css: ['components/message/message.css']
  });
}])

.controller('MessageCreateCtrl', ['$scope','$location','$http','$routeParams','Flash','auth', function($scope,$location,$http,$routeParams,Flash,auth) {
    $scope.create = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadId = $location.search()['thread'];
	let authorId = 1; //auth.getUser.id 
	
	$http.post(GW_CREATE_MESSAGE_URL,
		JSON.stringify({'author':authorId, 'thread':threadId, 'content':$scope.messageContent})
	).then((res) => {
	    // success
	    Flash.create('success', '<strong>Well done!</strong> You successfully created new message.');
	    $location.replace();
	    $location.search('thread', null);
	    $location.path('/thread/' + threadId);
	}, (res) => {
	    // fail
	    Flash.create('warning', '<strong>Oooops!</strong> Some error occurred. Try it again.');
	    console.log('[FAIL] message create');
	});
    };
    
    $scope.back = function(){
	if(!auth.isAuth()){
	    $location.path('/login');
	}
	
	let threadId = $location.search()['thread'];
	$location.replace();
	$location.search('thread', null);
	$location.path('/thread/' + threadId);
    };
}]);