


angular.module('beer').controller('TonightCtrl',['$scope','model',function($scope,model){

  $scope.app.title = 'Vad alla dricker'


  //FIXME: this is exactly the same as beer ctrl
  //but I'm to tired tonight to fix it. 
  var setState = function(){
    $scope.app.loading = false  
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