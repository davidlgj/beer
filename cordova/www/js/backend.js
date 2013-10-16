

angular.module('beer').factory('backend',['$http',function($http){

  return {
    users: function(){
      return $http.get('users').then(function(o){ return o.data.users })
    },
    addUser: function(name) {
      return $http.put('users',{ "name": name})
    },
    //TODO: delete user. Should that delete beers as well?
    deleteUser: function(name) {
      return $http.delete('users',{ "name": name})
    },
    

    beers: function(from) {
      if (from) {
        //parseInt will sanitize input a bit
        return $http.get('beers/'+parseInt(from,10)).then(function(o){ return o.data.beers })
      } else {
        return $http.get('beers').then(function(o){ return o.data.beers })
      }
    },
    length: function(){
      return $http.get('beers/length').then(function(res){
        return res.data
      })
    },
    add: function(beer) {
      console.log('add beer',beer)
      return $http.put('beers',beer)
    }

  };
}]);