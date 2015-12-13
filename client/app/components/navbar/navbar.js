'use strict';

angular.module('simpleForum.navbar', [])

.controller('NavbarCtrl', ['$scope','$location','auth', function($scope,$location,auth) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
    
    $scope.isEnabled = function (elementLocation) { 
        if(auth.isAuth()){
            /* authorized section */
            switch(elementLocation){
            	case '/home':
            	case '/threads':
            	case '/thread':
            	case '/logout':
            	    return true;
            	default:
            	    return false;
            }
        } else{
            /* unauthorized section */
            switch(elementLocation){
        	case '/home':
        	case '/login':
        	    return true;
        	default:
        	    return false;
            }
        }
    };
}]);