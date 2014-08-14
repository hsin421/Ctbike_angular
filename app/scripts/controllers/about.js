'use strict';

/**
 * @ngdoc function
 * @name yoAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the yoAngularApp
 */
var App = angular.module('yoAngularApp');
  App.controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
 
 