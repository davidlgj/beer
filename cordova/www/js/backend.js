

angular.module('beer').factory('backend',['$http',function($http){

    var server = ''
    if (window.cordova) {
        console.log('hello cordova!')
        server = 'pi.burningbroccoli.se/'
    }


  return {
    users: function(){
      return $http.get(server+'users').then(function(o){ return o.data.users })
    },
    addUser: function(name) {
      return $http.put(server+'users',{ "name": name})
    },
    //TODO: delete user. Should that delete beers as well?
    deleteUser: function(name) {
      return $http.delete(server+'users',{ "name": name})
    },
    

    beers: function(from) {
      if (from) {
        //parseInt will sanitize input a bit
        return $http.get(server+'beers/'+parseInt(from,10)).then(function(o){ return o.data.beers })
      } else {
        return $http.get(server+'beers').then(function(o){ return o.data.beers })
      }
    },
    length: function(){
      return $http.get(server+'beers/length').then(function(res){
        return res.data
      })
    },
    add: function(beer) {
      console.log('add beer',beer)
      return $http.put(server+'beers',beer)
    }

  };
}]);