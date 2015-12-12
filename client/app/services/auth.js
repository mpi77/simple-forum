'use strict';

const GW_LOGIN_URL = "http://private-c7d92-pwx.apiary-mock.com/session/";
const GW_FETCH_USER_URL = "GEThttp://private-c7d92-pwx.apiary-mock.com/users/";

class Auth {
  constructor($http) {
    this.$http = $http;
    this.token = localStorage.getItem('token');
    this.user  = localStorage.getItem('user');
  }

  isAuth() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  login(username, password) {
    return this.$http.post(GW_LOGIN_URL,
                      JSON.stringify({username, password})
    ).then((res) => {
      this.token = res.data.access_token;
      this.user = res.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', this.user);
      
      console.log("successfull authorization");
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
  }
}

Auth.$inject = ['$http'];

class AuthInterceptor {
    
    /* ngInject */
    constructor($q, $location) {
        this.$q = $q;
        this.$location = $location;
    }
    
    request(config) {
	const token = localStorage.getItem('token');
	if (token) {
	    config.headers.Authorization = 'Bearer ' + token;
	}
	return config;
    }
  
    responseError(rejection){
	if(rejection.status === 401 || rejection.status === 403) {
	    $location.path('/login');
	}
	$q.reject(rejection);
    }
}

config.$inject = ['$httpProvider'];

function config($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}

export default angular.module('simpleForum.auth', [])
  .service('auth', Auth)
  .service('authInterceptor', AuthInterceptor)
  .config(config)
  .name;