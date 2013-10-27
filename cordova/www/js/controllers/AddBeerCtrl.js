

angular.module('beer').controller('AddBeerCtrl',['$scope','model',function($scope,model){

  $scope.app.title = 'Registrera öl'
  $scope.beer = { name: '', rating: 3 }
  $scope.working = false

  var data = model.names()
  $scope.beers = data.beers || []
  $scope.brewers = data.brewers || []
  $scope.places = data.places || []

  $scope.setRating = function(rating) {
    $scope.beer.rating = rating;
  };

  $scope.addBeer = function() {
    $scope.working = true;
    model.add($scope.app.currentUser,$scope.beer.name,$scope.beer.brewery,$scope.beer.where,$scope.beer.comment,$scope.beer.rating)
         .then(function(){
            $scope.beer = { name: '', rating: 3 }
            $scope.page('beers')
          })
  }

  $scope.cancel = function(){
    $scope.beer = { name: '', rating: 3 }
    $scope.page('beers')
  }

}])