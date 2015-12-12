'use strict';

import 'jquery';
import 'bootstrap';
import 'angular';
import 'angular-route';

import './services/auth.js';
import './components/home/home.js';
import './components/session/session.js';
import './components/thread/thread.js';
import './components/message/message.js';

angular.module('simpleForum', [
  'ngRoute',
  'simpleForum.home',
  'simpleForum.session',
  'simpleForum.thread',
  'simpleForum.message',
  'simpleForum.auth'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
