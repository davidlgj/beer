angular.module('beer').directive('rating',[function(){

  var def = {
    template: '<div class="rating"><span ng-click="setRating($index+1)" ng-repeat="i in ratings"><i ng-class="{ \'rating-star\': i<=value,\'rating-star-empty\': i>value }"></i></span></div>',
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
