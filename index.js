let angular = require('angular');

function rootScopeFunctionalDecorator($delegate) {
  $delegate.$$definitions = {};

  function $define(property, definition) {
    this.$$definitions[property] = definition;
  };

  function $update(changes) {
    for (var key in changes) {
      this[key] = changes[key];
    }
    for (var key in this.$$definitions) {
      var result = this.$$definitions[key]();
      if (this[key] !== result) {
        this[key] = result;
      }
    }
  };

  $delegate.$define = $define;
  $delegate.$update = $update;

  var ScopeConstructor = $delegate.constructor;

  $delegate.constructor = function() {
    var newScope = ScopeConstructor.apply(this, arguments);
    newScope.$$definitions = {};
    newScope.$define = $define.bind(newScope);
    newScope.$update = $update.bind(newScope);
  }

  return $delegate;
}

module.exports = angular.module('functional-scope', [])
  .config(function($provide) {
    $provide.decorator('$rootScope', rootScopeFunctionalDecorator)
  });

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
      controller: function($scope) {
        $scope.innerNumber = 0;

        $scope.pickInnerNumber = function() {
          $scope.$update({
            innerNumber: getRandomIntUpTo(10)
          });
        };

        $scope.$define('sum', function() {
          debugger;
          return $scope.number + $scope.innerNumber;
        });
      },
      template: `
        <div style="border: 2px solid red; margin: 10px;">
          <h2>Inner Number Picker</h2>
          <p>Number is: {{innerNumber}}</p>
          <p>Sum is: {{sum}}</p>
          <button ng-click="pickInnerNumber()">Pick an Inner Number</button>
        </div>
      `
    };
  });
