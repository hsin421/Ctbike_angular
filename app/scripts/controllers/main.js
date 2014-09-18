'use strict';

/**
 * @ngdoc function
 * @name yoAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoAngularApp
 */

/* @FINALPROJECTCOMMENT, don't think the controller and all these comments are necessary */
/* @FINALPROJECTCOMMENT, this module syntax is a much better way than using the global 'App' variable */
angular.module('yoAngularApp').controller('FirebaseCtrl', function ($scope, $firebase) {
    $scope.typein = null;
    var ref = new Firebase('https://luminous-fire-6005.firebaseio.com/hsin');

    var sync = $firebase(ref);

    // var syncObject = sync.$asArray();
    $scope.message = sync.$asArray();
    $scope.username = "";
    $scope.addMessage = function (text) {
        $scope.message.$add({myInput: $scope.username + ": " + text});
        $scope.newMessageText = "";
    };

    $scope.toggleMe = function () {
        if ($scope.toShow) {
            $scope.toShow = false
        } else {
            $scope.toShow = true
        }
        /* @FINALPROJECTCOMMENT, there was a bad semi colon down here */
    }
});


