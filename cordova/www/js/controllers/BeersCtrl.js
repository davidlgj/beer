


angular.module('beer').controller('BeersCtrl',['$scope','model',function($scope,model){

  $scope.app.title = 'Öl'

  $scope.selectedBeer = { }  
  
  //TODO: refactor to dry this up
  var daystr = function(when) {
    var date = new Date(when)
    return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()  
  }

  $scope.toggleSelection = function(index,when) {
    var key = angular.isDefined(when)?daystr(when):daystr(Date.now())
    if ($scope.selectedBeer[key] === index) {
      delete $scope.selectedBeer[key]
    } else {
      $scope.selectedBeer[key] = index
    }
  }

  $scope.isBeerSelected = function(index,when) {
    var key = angular.isDefined(when)?daystr(when):daystr(Date.now())
    return $scope.selectedBeer[key] === index
  }


  var setState = function(){
    
    if ($scope.app.currentUser && $scope.app.currentUser !== "") {
      var days = model.days($scope.app.currentUser)
      console.log('days',days)
      var today = new Date()
      if (days.length > 0 && days[0].length) {
        var beerdate = new Date(days[0][0].when)
        
        if (today.getDate() === beerdate.getDate() && today.getMonth() === beerdate.getMonth() && today.getFullYear() === beerdate.getFullYear()) {  
          $scope.today = days.shift()
        } else {
          $scope.today = [];
        }
        
        $scope.days  = days
      }
    }
  }

  model.sync().then(setState)

  $scope.sync = function(){
    model.sync().then(setState)
  }
}]) 