'use strict';

import 'jquery';
import 'bootstrap';
import 'angular';
import 'angular-route';
import 'angular-flash-alert';

import './services/auth.js';
import './components/home/home.js';
import './components/session/session.js';
import './components/thread/thread.js';
import './components/message/message.js';
import './components/navbar/navbar.js';

angular.module('simpleForum', [
  'ngRoute',
  'flash',
  'simpleForum.home',
  'simpleForum.session',
  'simpleForum.thread',
  'simpleForum.message',
  'simpleForum.auth',
  'simpleForum.navbar'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
