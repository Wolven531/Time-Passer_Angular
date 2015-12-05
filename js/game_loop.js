'use strict';
angular.module('timePasserFilters', []).filter('bigNum', function() {
  return function(number, fractionSize) {
    if(number === null) {
      return null;
    }
    if(number === 0) {
      return '0';
    }
    if(!fractionSize || fractionSize < 0) {
      fractionSize = 3;
    }
    var abs = Math.abs(number);
    var rounder = Math.pow(10, fractionSize);
    var isNegative = number < 0;
    var key = '';
    var powers = [
      { key: ' Decillion', value: Math.pow(10, 33) },
      { key: ' Nonillion', value: Math.pow(10, 30) },
      { key: ' Octillion', value: Math.pow(10, 27) },
      { key: ' Septillion', value: Math.pow(10, 24) },
      { key: ' Sextillion', value: Math.pow(10, 21) },
      { key: ' Quintillion', value: Math.pow(10, 18) },
      { key: ' Quadrillion', value: Math.pow(10, 15) },
      { key: ' Trillion', value: Math.pow(10, 12) },
      { key: ' Billion', value: Math.pow(10, 9) },
      { key: ' Million', value: Math.pow(10, 6) },
      { key: ' K', value: 1000 }
    ];
    for(var a = 0; a < powers.length; a++) {
      var reduced = abs / powers[a].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if(reduced >= 1){
        abs = reduced;
        key = powers[a].key;
        break;
      }
    }
    var tmp = parseFloat((isNegative ? '-' : '') + abs, 10);
    return '$' + tmp.toFixed(2) + key;
  };
});

angular.module('timePasser', ['timePasserFilters'])
  .controller('PlayerNameController', function($scope) {
    //$scope.player_name = 'asdf';
  })
  .controller('wealthController', function($scope, $interval) {
    $scope.unitCache = new UnitCache();
    $scope.money_profit = 1;
    $scope.player_money = 0;
    $scope.money_spent = 0;
    $scope.purchase_mode = 1;

    $scope.makeMoney = function() {
      $scope.player_money += 1.00;
    };

    $scope.buyUnit = function(type) {
      var unit = $scope.unitCache.getUnit(type);
      if($scope.canBuyUnit(type)) {
        var cost = unit.getAdjustedCost($scope.purchase_mode);
        $scope.player_money -= cost;
        $scope.money_spent += cost;
        $scope.unitCache.addUnit(type, $scope.purchase_mode);
        if(unit.getTimer() === null) {// if there is no timer on unit
          var tmpTimer = $interval(function() {// set one up
            $scope.player_money += unit.getProfit() * $scope.unitCache.getUnitCount(type);// increase cash
            if($scope.unitCache.getUnitCount(type) < 1) {// make sure there's still units from the last interval
              $interval.cancel(unit.getTimer());
              unit.setTimer(null);// and reset the timer
            }
          }, unit.getTick() * 1000);
          unit.setTimer(tmpTimer);
        }
      }
    };

    $scope.canBuyUnit = function(type) {
      var unit = $scope.unitCache.getUnit(type);
      return $scope.player_money >= (unit.getAdjustedCost($scope.purchase_mode));
    };

    $scope.getTotalIncome = function() {
      var sum = 0;
      var units = $scope.unitCache.getAllUnits();
      Object.keys(units).forEach(function(unitName) {
        sum += ($scope.unitCache.getUnitCount(unitName) * units[unitName].getProfit()) / units[unitName].getTick();
      });
      return sum;
    };

    $scope.setPurchaseMode = function(num) {
      $scope.purchase_mode = num;
    };
  });
