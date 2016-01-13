'use strict';

import 'jquery';
import 'bootstrap';
import 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-flash-alert';
import 'angular-loading-bar';

import './services/auth.js';
import './components/home/home.js';
import './components/session/session.js';
import './components/thread/thread.js';
import './components/message/message.js';
import './components/navbar/navbar.js';

angular.module('simpleForum', [
  'ngRoute',
  'ngAnimate',
  'simpleForum.auth',
  'angular-loading-bar',
  'simpleForum.home',
  'simpleForum.session',
  'simpleForum.thread',
  'simpleForum.message',
  'simpleForum.navbar',
  'flash'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
