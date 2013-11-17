
angular.module('beer').factory('model',['backend',function(backend){
  //Then model in the backend is a list but on the frontend we sort them
  //id is composite of user name and beer timestamp
  var model = null //localStorage.getItem('model') Just backend until doing proper offline support
  console.log('model in storage',model)

  if (!model) {
    model = { length: 0, beers: {} } 
  } else {
    //stored models only have beers
    //not days
    model.days = {}
  }

  //utilities
  //create a id for a day
  var  beerId = function(beer) { return beer.name + '/' + beer.when }

  //TODO: make sync two-way enabling offlne
  var sync = function(){
    //since items in the list is never removed we just check for more 
    return backend.beers(model.length).then(function(beers){
      angular.forEach(beers,function(beer){
        model.length++
        
        var id = beerId(beer)
        if (model.beers[id]) {
          //it's a beer diff!
          if (beer.delete) {
            delete model.beers[id]
          } else {
            angular.extend(model.beers[id],beer)
          }
        } else {
          model.beers[id] = beer
        }
        console.log('synced')
      })
    })
  }

  var pad = function(nr) {
    if (nr < 10) {
      return '0'+nr
    }
    return nr
  }

  return {
    sync: sync,
    names: function(){
      var names = {}
      var brewers = {}
      var places = {} 
      var beerToBrewery = {}

      angular.forEach(model.beers,function(beer){
        names[beer.name] = true
        if (beer.where) {
            places[beer.where] = true
        }
        if (beer.brewery) {
            brewers[beer.brewery] = true
            beerToBrewery[beer.name] = beer.brewery
        }
      })
      
      var beers = []
      angular.forEach(names,function(v,k){ beers.push(k) })
      
      var brews = []
      angular.forEach(brewers,function(v,k){ brews.push(k) })

      var where = []
      angular.forEach(places,function(v,k){ where.push(k) })      

      return {
        beers: beers,
        brewers: brews,
        places: where,
        beerToBrewery: beerToBrewery
      }
    },
    days: function(user){
      var days = {}
      var date = new Date()
      var dates = []
      angular.forEach(model.beers,function(beer){
        date.setTime(beer.when)
        var daystr = date.getFullYear()+'-'+pad(date.getMonth())+'-'+pad(date.getDate())  
        if (!user || beer.user === user) {
          if (!days[daystr]) {
            days[daystr] = []
            dates.push(daystr)
          }
          days[daystr].push(beer)
        }
      })

      //ok let's sort them and put them in an array
      dates.sort()
      var sorted = []
      var sortfunc = function(a,b){
        return b.when - a.when
      }
      for (var i=dates.length-1; i >= 0; i--) {
        days[dates[i]].sort(sortfunc)
        sorted.push(days[dates[i]])
      }


      return sorted
    },
    add: function(user,name,brewery,where,comment,rating) {
       return backend.add({
          user: user,
          when: Date.now(),
          where: where,
          name: name,
          brewery: brewery,
          comment: comment || '',
          rating: rating
       })
    },
    edit: function(diff){
      return backend.add(diff).then(sync)
    },
    delete: function(user,when) {
      return backend.add({
          user: user,
          when: when,
          delete: true
       }).then(sync)
    }
  };
}])