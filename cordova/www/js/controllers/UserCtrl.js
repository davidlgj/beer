

angular.module('beer').controller('UserCtrl',['$scope','$location','backend',function($scope,$location,backend){

  $scope.app.title = 'Användarnamn'
  $scope.users = []
  $scope.app.loading = false

  var updateList = function(){
    backend.users().then(function(users){
      console.log('users from backend',users)
      $scope.users = users
    })
  }
  updateList()

  $scope.setName = function(name) {
    localStorage.setItem('name',name)
    backend.addUser(name) //users is a set so we can add
    
    $scope.app.currentUser = name

    updateList()
    $scope.page('beers')
  }

}])