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

.controller('MessageCreateCtrl', ['$scope','$location','$http','$routeParams','auth', function($scope,$location,$http,$routeParams,auth) {
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
	    console.log('create message ok');
	    $location.replace();
	    $location.search('thread', null);
	    $location.path('/thread/' + threadId);
	}, (res) => {
	    // fail
	    console.log('create message fail');
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