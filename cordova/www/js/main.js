angular.module('beer',['ui.bootstrap'])
       .config(function($tooltipProvider){
          $tooltipProvider.setTriggers({
            'error': 'ok'
          });
       });


angular.module('beer').controller('BeerCtrl',[
        '$scope','model','backend',
function($scope,  model,  backend){
  
  $scope.menuState = false
  $scope.beer = { name: '', rating: 3 }

  $scope.view = 'name'
  var name = localStorage.getItem('name')
  if (name) {
      console.log('Welcome '+name)
      $scope.name = name
      $scope.view = 'list'
  }

  $scope.users = []
  backend.users().then(function(users){
    console.log('users from backend',users)
    $scope.users = users
  })

  var setState = function(){
    console.log('set state model',$scope.name)
    $scope.beers = model.names() 
    if ($scope.name && $scope.name !== "") {
      $scope.today = model.today($scope.name)
      $scope.days  = model.older($scope.name)
    }
  }

  model.sync().then(setState)

  $scope.setRating = function(rating) {
    $scope.beer.rating = rating;
  };

  $scope.addBeer = function() {
    console.log($scope.beer)
    model.add($scope.name,$scope.beer.name,$scope.beer.comment,$scope.beer.rating)
         .then(setState)

    //data that will do in the meantime
    $scope.today.push($scope.beer)
    $scope.beer = { name: '', rating: 3 }
    $scope.view = 'list'

    //
  }

  $scope.cancel = function(){
    $scope.beer = { name: '', rating: 3 }
    $scope.view = 'list'
  }

  $scope.setName = function(name) {
    localStorage.setItem('name',name)
    backend.addUser(name) //users is a set so we can add
    $scope.view = 'list'
    $scope.name = name

    //update state since we're a new user
    setState()

    //update users list
    backend.users().then(function(users){
      console.log('users from backend',users)
      $scope.users = users
    })
  }

  $scope.add = function(){
    $scope.menuState = false
    $scope.view = 'add'
  }

  $scope.today = function(){
    $scope.menuState = false
    $scope.view = 'list'
  }

  $scope.changeUser = function(){
    $scope.menuState = false
    $scope.view = 'name'
  }

  //FIXME: move to directive
  $scope.toggleMenu = function(){
    $scope.menuState = !$scope.menuState;
  }

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
