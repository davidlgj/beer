

angular.module('beer').controller('AddBeerCtrl',['$scope','model',function($scope,model){

  $scope.app.title = 'Registrera öl'
  $scope.beer = { name: '', rating: 3 }
  $scope.working = false
  $scope.app.loading = false

  var data = model.names()
  console.log(data)
  $scope.beers = data.beers || []
  $scope.brewers = data.brewers || []
  $scope.places = data.places || []
  $scope.types = data.types || []
  var beerToBrewery = data.beerToBrewery || {}
  var beerToType = data.beerToType || {}

  $scope.setRating = function(rating) {
    $scope.beer.rating = rating;
  };

  $scope.addBeer = function() {
    $scope.working = true;
    model.add($scope.app.currentUser,$scope.beer.name,$scope.beer.brewery,$scope.beer.type,$scope.beer.where,$scope.beer.comment,$scope.beer.rating)
         .then(function(){
            $scope.beer = { name: '', rating: 3 }
            $scope.page('beers')
          })
  }

  $scope.cancel = function(){
    $scope.beer = { name: '', rating: 3 }
    $scope.page('beers')
  }

  //when beer changes check if brewery and or type is set
  //otherwise fill it in
  $scope.$watch('beer.name',function(name,old) {
    
    if (beerToBrewery[name] && !$scope.beer.brewery && $scope.beer.brewery !== "") {
      $scope.beer.brewery = beerToBrewery[name]
    }
    console.log($scope.types,beerToType,$scope.beer.type)
    if (beerToType[name] && !$scope.beer.type && $scope.beer.type !== "") {
      $scope.beer.type = beerToType[name]
    }
  })

}])