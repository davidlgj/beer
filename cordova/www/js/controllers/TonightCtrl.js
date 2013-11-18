


angular.module('beer').controller('TonightCtrl',['$scope','model',function($scope,model){

  $scope.app.title = 'Vad alla dricker'


  $scope.selectedBeer = { }  

  //FIXME: this is exactly the same as beer ctrl
  //but I'm to tired tonight to fix it. 

  //TODO: refactor to dry this up
  var daystr = function(when) {
    var date = new Date(when)
    return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()  
  }

  $scope.toggleSelection = function(key) {
    if ($scope.selectedBeer[key]) {
      delete $scope.selectedBeer[key]
    } else {
      $scope.selectedBeer[key] = true
    }
  }

  $scope.isBeerSelected = function(key) {
    return $scope.selectedBeer[key] === true
  }

  var setState = function(){
    
    if ($scope.app.currentUser && $scope.app.currentUser !== "") {
      var days = model.days()
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