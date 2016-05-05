require('angular-functional-scope');
let angular = require('angular');

angular.module('TestApp', ['functional-scope'])
  .directive('testDirective', function() {
    return {
      controller: function($scope) {
        $scope.$define('greaterThan5', function() {
          return $scope.number > 5;
        });
        $scope.pickNumber = function() {
          $scope.$update({
            number: Math.random() * 10
          });
        };
      }
    };
  });
