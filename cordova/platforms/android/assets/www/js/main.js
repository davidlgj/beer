angular.module('beer',['ui.bootstrap'])
       .config(function($tooltipProvider){
          $tooltipProvider.setTriggers({
            'error': 'ok'
          });
       });


angular.module('beer').controller('BeerCtrl',[
        '$scope',
function($scope){
  

  $scope.view = 'name';
  var name = null; //localStorage.getItem('name'); DEBUG: always ask
  if (name) {
      $scope.name = name;
      $scope.view = 'list';
  }

  $scope.beer = { name: '',rating: 3};
  $scope.ratings  = [1,2,3,4,5];
  //some test data
  $scope.beers = ['Bedarö Bitter','Pripps Blå','Carlsberg'];
  $scope.today = [{ name: $scope.beers[0], rating: 5},{ name: $scope.beers[1], rating: 2},{ name: $scope.beers[2], rating: 1}];

  $scope.days = [
    { date: Date.now(), beers: $scope.today.slice(0) },
    { date: Date.now(), beers: $scope.today.slice(0) },
    { date: Date.now(), beers: $scope.today.slice(0) },
  ];

  $scope.setRating = function(rating) {
    $scope.beer.rating = rating;
  };

  $scope.addBeer = function() {
    $scope.today.push($scope.beer);
    $scope.beer = { name: '', rating: 3 };
    $scope.view = 'list';
  };

  $scope.cancel = function(){
    $scope.beer = { name: '', rating: 3 };
    $scope.view = 'list';
  };

  $scope.setName = function(name) {
    localStorage.setItem('name',name);
    $scope.view = 'list';
  };

  $scope.add = function(){
    $scope.view = 'add';
  };

}]).directive('fullHeight', function() {    
  
  return function(scope, element) {
    element.css('min-height',document.documentElement.clientHeight+'px');
  };

}).directive('tap', ['$parse',function($parse) {
    
  return function(scope, element, attrs) {
    var callback= function() {
      var fn = $parse(attrs.tap);

      scope.$apply(function() {
        fn(scope);
      });
    };

    if ('ontouchstart' in document.documentElement) {
      var handler = {
        touchstart: function(event){
          element.on('touchmove',handler.touchmove);
          element.on('touchcancel',handler.clear);
          element.on('touchend',handler.touchend);
          handler.clientX = event.touches[0].clientX;
          handler.clientY = event.touches[0].clientY;
        },
        touchend: function(){
          handler.clear();
          callback();
        },
        clear: function(){
          element.off('touchmove',handler.touchmove);
          element.off('touchcancel',handler.clear);
          element.off('touchend',handler.touchend);
        },
        touchmove: function(event){
          var dx = Math.abs(handler.clientX-event.touches[0].clientX);
          var dy = Math.abs(handler.clientY-event.touches[0].clientY);
          if (dy > 10 || dx > 10) {
            handler.clear();
          } 
        }
      };

      element.on('touchstart',handler.touchstart);
      scope.$on('$destroy', function() {
        element.off('touchstart',handler.touchstart);
      });
    } else {
      element.on('click',callback);
      scope.$on('$destroy', function() {
        element.off('click',callback);
      });
    }
  };
}]).directive('rating',[function(){

  var def = {
    template: '<div class="rating"><span tap="setRating($index+1)" ng-repeat="i in ratings"><i ng-class="{ \'icon-star\': i<=value,\'icon-star-empty\': !readOnly && i>value }"></i></span></div>',
    replace: true,
    transclude: false,
    restrict: 'E',
    scope: {
      value: "="
    },
    link: function(scope,element,attrs) {
      scope.ratings = [1,2,3,4,5];  //for ng-repeat to loop over
      scope.readOnly = angular.isDefined(attrs.readOnly);
      scope.setRating = function(rating) {
        if (!scope.readOnly) {
          scope.value = rating;
        }
      };
    }
  };
  return def;
}]);
