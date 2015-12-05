'use strict';

function Unit(options) {
  var requiredFields = ['name', 'cost', 'tick', 'profit', 'growth'];
  requiredFields.forEach(function(currField) {
    if(options === undefined || options[currField] === undefined){
      throw new Error('Unit construction missing required field, "' + currField + '"');
    }
  });
  var name = options.name;
  var cost = options.cost;
  var tick = options.tick;
  var profit = options.profit;
  var growth = options.growth;
  var timer = null;

  this.getName = function() {
    return name;
  };
  this.getCost = function() {
    return cost;
  };
  this.getTick = function() {
    return tick;
  };
  this.getProfit = function() {
    return profit;
  };
  this.getTimer = function() {
    return timer;
  };
  this.getGrowth = function() {
    return growth;
  };
  this.getAdjustedCost = function(num) {
    var lastCost = this.getCost();
    var sum = lastCost;
    for(var a = 1; a < num; a++) {
      lastCost = lastCost * this.getGrowth();
      sum += lastCost;
    }
    return sum;
  };
  this.setName = function(newName) {
    name = newName;
  };
  this.setCost = function(newCost) {
    cost = newCost;
  };
  this.setTick = function(newTick) {
    tick = newTick;
  };
  this.setProfit = function(newProfit) {
    profit = newProfit;
  };
  this.setTimer = function(newTimer) {
    timer = newTimer;
  };
  this.setGrowth = function(newGrowth) {
    growth = newGrowth;
  };
}

function UnitCache(options) {
  var unitTypes = (options && options.unitTypes) ||
    {
      'worker': new Unit({
        name: 'Worker',
        cost: 5,
        tick: 1,
        profit: 0.1,
        growth: 1.01
      }),
      'engineer': new Unit({
        name: 'Engineer',
        cost: 50,
        tick: 0.75,
        profit: 0.5,
        growth: 1.05
      }),
      'supervisor': new Unit({
        name: 'Supervisor',
        cost: 500,
        tick: 1.5,
        profit: 3,
        growth: 1.1
      }),
      'ceo': new Unit({
        name: 'CEO',
        cost: 50000,
        tick: 0.5,
        profit: 5,
        growth: 1.2
      })
    };
  var unitCounts = {};
  Object.keys(unitTypes).forEach(function(unitType) {
    unitCounts[unitType] = 0;
  });

  this.getUnit = function(type) {
    if(unitTypes[type] !== undefined) {
      return unitTypes[type];
    }
    throw new Error('Invalid unit type for unitCache.getUnit(), "' + type + '"');
  };
  this.getUnitCount = function(type) {
    if(unitTypes[type] !== undefined) {
      return unitCounts[type];
    }
    throw new Error('Invalid unit type for unitCache.getUnitCount(), "' + type + '"');
  };
  this.addUnit = function(type, num) {
    num = num || 1;// optional param can add more than one, so default to one
    if(unitTypes[type] !== undefined) {
      var unit = unitTypes[type];
      unitCounts[type] += num;
      var newCost = unit.getCost();
      for(var a = 0; a < num; a++) {
        newCost = newCost * unit.getGrowth();
      }
      unit.setCost(newCost);
      return;
    }
    throw new Error('Invalid unit type for unitCache.addUnit(), "' + type + '"');
  };
  this.getAllUnits = function() {
    return unitTypes;
  };
}
