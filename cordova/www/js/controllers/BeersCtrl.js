


angular.module('beer').controller('BeersCtrl',['$scope','model',function($scope,model){

  $scope.app.title = 'Öl - '+$scope.app.currentUser

  console.log('Beeeeeeeer')

  var setState = function(){
    $scope.app.loading = false
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


  $scope.remove = function(beer){
    //safety check
    if (beer.user !== $scope.app.currentUser) {
      console.log(beer.user,$scope.app.currentUser)
      return
    }
    if (window.cordova) {
      navigator.notification.confirm('Ta bort?', function(button){
        if (button === 1) {
            $scope.$apply(function(){
              model.remove(beer.user,beer.when).then(setState)
            })
        }
      })
    } else {
      if (window.confirm('Ta bort?')) {
        $scope.$apply(function(){
          model.delete(beer.user,beer.when).then(setState)
        })
      }
    }
  }


}]) 