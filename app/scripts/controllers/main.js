'use strict';

/**
 * @ngdoc function
 * @name yoAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoAngularApp
 */
var App = angular.module('yoAngularApp');
  App.controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
//   App.controller('AccordionDemoCtrl', function ($scope) {
//   $scope.oneAtATime = true;

//   $scope.groups = [
//     {
//       title: 'Dynamic Group Header - 1',
//       content: 'Dynamic Group Body - 1'
//     },
//     {
//       title: 'Dynamic Group Header - 2',
//       content: 'Dynamic Group Body - 2'
//     }
//   ];

//   $scope.items = ['Item 1', 'Item 2', 'Item 3'];

//   $scope.addItem = function() {
//     var newItemNo = $scope.items.length + 1;
//     $scope.items.push('Item ' + newItemNo);
//   };

//   $scope.status = {
//     isFirstOpen: true,
//     isFirstDisabled: false
//   };
// });
// App.controller('DatepickerDemoCtrl', function ($scope) {
//   $scope.today = function() {
//     $scope.dt = new Date();
//   };
//   $scope.today();

//   $scope.clear = function () {
//     $scope.dt = null;
//   };

//   // Disable weekend selection
//   $scope.disabled = function(date, mode) {
//     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//   };

//   $scope.toggleMin = function() {
//     $scope.minDate = $scope.minDate ? null : new Date();
//   };
//   $scope.toggleMin();

//   $scope.open = function($event) {
//     $event.preventDefault();
//     $event.stopPropagation();

//     $scope.opened = true;
//   };

//   $scope.dateOptions = {
//     formatYear: 'yy',
//     startingDay: 1
//   };

//   $scope.initDate = new Date('2016-15-20');
//   $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
//   $scope.format = $scope.formats[0];
// });

// App.controller('ProgressDemoCtrl',function ($scope) {

//   $scope.max = 200;

//   $scope.random = function() {
//     var value = Math.floor((Math.random() * 100) + 1);
//     var type;

//     if (value < 25) {
//       type = 'success';
//     } else if (value < 50) {
//       type = 'info';
//     } else if (value < 75) {
//       type = 'warning';
//     } else {
//       type = 'danger';
//     }

//     $scope.showWarning = (type === 'danger' || type === 'warning');

//     $scope.dynamic = value;
//     $scope.type = type;
//   };
//   $scope.random();

//   $scope.randomStacked = function() {
//     $scope.stacked = [];
//     var types = ['success', 'info', 'warning', 'danger'];

//     for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
//         var index = Math.floor((Math.random() * 4));
//         $scope.stacked.push({
//           value: Math.floor((Math.random() * 30) + 1),
//           type: types[index]
//         });
//     }
//   };
//   $scope.randomStacked();
// });

App.controller('FirebaseCtrl', function ($scope, $firebase){
    $scope.typein = null;
 	var ref = new Firebase('https://luminous-fire-6005.firebaseio.com/hsin');

  var sync = $firebase(ref);

 // var syncObject = sync.$asArray();
  $scope.message =  sync.$asArray();
  console.log($scope.message);
   $scope.addMessage = function(text) {
    $scope.message.$add({myInput: text});
  };
  $scope.toggleMe = function(){
    if ($scope.toShow){ $scope.toShow = false}else{$scope.toShow = true};
  }
  //syncObject.$bindTo($scope, 'data');
 	// ref.on('value', function (snapshot) {
  // 		$scope.value1 = (snapshot.val()); });
 	// $scope.fbwrite = function() {
 		
 	// 	ref.push({myInput: $scope.typein});
 	// };

 });

// App.directive('ngFocus', [function() { 
// 	var FOCUS_CLASS = "ng-focused"; return {
// 	restrict: 'A',
// 	require: 'ngModel',
// 	link: function(scope, element, attrs, ctrl) {
// 	ctrl.$focused = false; element.bind('focus', function(evt) {
// 	element.addClass(FOCUS_CLASS); scope.$apply(function() {
// 	ctrl.$focused = true; });
// 	}).bind('blur', function(evt) {
// 	element.removeClass(FOCUS_CLASS); scope.$apply(function() {
// 		ctrl.$focused = false; });
// 		}); }
// 		} }]);


