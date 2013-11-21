
angular.module('beer').controller('BeerCtrl',[
        '$scope','$location','$rootScope',
function($scope,  $location,  $rootScope){

  //app global state
  $scope.app = {
    menuState: false,
    currentUser: null,
    title: '',
    loading: false
  }
  
  //check if we're been here before
  //otherwise show select user dialog 
  var name = localStorage.getItem('name')
  if (name) {
    console.log('Welcome '+name)
    $scope.app.currentUser = name
    $location.path('/beers')
  } else {
    $location.path('/user')
  }


  $scope.toggleMenu = function(){
    $scope.app.menuState = !$scope.app.menuState
  }

  //since we use the touch support in angular we cant simply use links
  //as we ordinary would. That would incur the "slow" link click penalty
  $scope.page = function(pth) {
    $scope.app.loading = true
    if (pth.indexOf('/') === -1) {
        pth = '/'+pth
    }
    $scope.app.menuState = false
    $location.path(pth)
  }

  $scope.deviceSize = window.innerWidth +'x' + window.innerHeight

}])