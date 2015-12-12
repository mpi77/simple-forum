'use strict';

const GW_LOGIN_URL = "http://private-c7d92-pwx.apiary-mock.com/session/";
const GW_FETCH_USER_URL = "GEThttp://private-c7d92-pwx.apiary-mock.com/users/";

class Auth {
  constructor($http) {
    this.$http = $http;
    this.token = localStorage.getItem('token');
    this.userid  = localStorage.getItem('userid');
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
      this.token = res.access_token;
      this.userid = res.id;
      localStorage.setItem('token', this.token);
      localStorage.setItem('userid', this.userid);
      
      /** TODO */
      this.user = null;
      localStorage.setItem('user', this.user);
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('user');
    this.token = null;
    this.userid = null;
    this.user = null;
  }
}

Auth.$inject = ['$http'];

class AuthInterceptor {
  request(config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
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