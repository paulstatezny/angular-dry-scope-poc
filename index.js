let angular = require('angular');
require('angular-functional-scope');

function getRandomIntUpTo(max) {
  return Math.floor(Math.random() * max);
}

angular.module('TestApp', ['functional-scope'])
  .directive('numberPicker', function() {
    return {
      controller: function($scope) {
        $scope.number = 0;

        $scope.pickNumber = function() {
          $scope.$update({
            number: getRandomIntUpTo(50)
          });
        };
      },
      template: `
        <div style="border: 2px solid blue; margin: 10px">
          <h1>Number Picker</h1>
          <p>Number is: {{number}}</p>
          <button ng-click="pickNumber()">Pick a Number</button>
          <div inner-number-picker></div>
        </div>
      `
    };
  })
  .directive('innerNumberPicker', function() {
    return {
      scope: {},
      controller: function($scope) {
        $scope.number = 0;

        $scope.pickNumber = function() {
          $scope.$update({
            number: getRandomIntUpTo(10)
          });
        };

        $scope.$define('sum', function() {
          return $scope.number + $scope.$parent.number;
        });
      },
      template: `
        <div style="border: 2px solid red; margin: 10px;">
          <h2>Inner Number Picker</h2>
          <p>Number is: {{number}}</p>
          <p>Sum is: {{sum}}</p>
          <button ng-click="pickNumber()">Pick an Inner Number</button>
        </div>
      `
    };
  });
