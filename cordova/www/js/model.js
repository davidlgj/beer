
angular.module('beer').factory('model',['backend',function(backend){
  //Then model in the backend is a list but on the frontend we sort them
  //id is composite of user name and beer timestamp
  var model = null //localStorage.getItem('model') Just backend until doing proper offline support
  console.log('model in storage',model)

  if (!model) {
    model = { length: 0, beers: {}, days: {},byuser: {} } 
  } else {
    //stored models only have beers
    //not days
    model.days = {}
    angular.forEach(model.beers,function(beer){
      addToDay(beer)
    })
  }

  //utilities
  //create a id for a day
  var  beerId = function(beer) { return beer.name + '/' + beer.when }

  var day = function(timestamp) {
    var d = new Date(timestamp)
    var m = d.getMonth()
    var date = d.getDate()
    return d.getFullYear()+'-'+(m<10?'0'+m:m)+'-'+(date<10?'0'+date:date)
  }

  var addToDay = function(beer) {
    var d = day(beer.when)
    if (!model.days[d]) {
      model.days[d] = []
    }
    model.days[d].push(beer)
    /*model.days[d].sort(function(a,b){
      return a.when - b.when
    })*/

    //and by user
    if (!model.byuser[beer.user]) {
      model.byuser[beer.user] = {}
    }
    if (!model.byuser[beer.user][d]) {
      model.byuser[beer.user][d] = []
    }
    model.byuser[beer.user][d].push(beer)
  }

  var removeFromDay = function(beer) {
    var d = day(beer.when)
    if (model.days[d]) {
      var dayList = model.days[d]
      for (var i=0; i<dayList.length; i++) {
        if (dayList[i].name === beer.name && dayList[i].when === beer.when) {
          model.days[d].splice(i,1)
          break;
        }
      }
    }
  }

  

  //TODO: make sync two-way enabling offlne
  var sync = function(){
    //since items in the list is never removed we just check for more 
    return backend.beers(model.length).then(function(beers){
      console.log('beers from backend',beers)

      angular.forEach(beers,function(beer){
        model.length++
        
        var id = beerId(beer)
        if (model.beers[id]) {
          //it's a beer diff!
          if (beer.delete) {
            delete model.beers[id]
            removeFromDay(beer)
          } else {
            angular.extend(model.beers[id],beer)
          }
        } else {
          model.beers[id] = beer

          //then add it to the proper day mapping
          addToDay(beer)
        }
      })

      console.log('model after sync',model)
    })
  }

  return {
    sync: sync,
    names: function(){
      var names = {}

      angular.forEach(model.beers,function(beer){
        names[beer.name] = true;
      })
      
      var beers = []
      angular.forEach(names,function(v,k){ beers.push(k) })
      console.log(beers)
      return beers;
    },
    today: function(user){
      if (user) {
        if (model.byuser[user]) {
          return model.byuser[user][day(Date.now())] || [];      
        } else {
          return [];
        }
      } else {
        return model.days[day(Date.now())] || [];
      }
    },
    older: function(user){
      var dates = []
      var data = []
      if (user ) {
        data = model.byuser[user] || []
      } else {
        data = model.days
      }
      angular.forEach(data,function(v,k){
          dates.push(k)
      })
      dates.sort()
      dates.reverse()

      //remove today if it's present
      if (dates[0] === day(Date.now())) {
        dates.unshift()
      }

      var days = []
      angular.forEach(dates,function(d){
        if (user) {
          days.push(model.byuser[user][d])
        } else {
          days.push(model.days[d])
        }
      })
      return days;
    },
    add: function(user,name,comment,rating) {
       return backend.add({
          user: user,
          when: Date.now(),
          name: name,
          comment: comment || '',
          rating: rating
       }).then(sync)
    },
    edit: function(diff){
      //FIXME: what should diff be? 
    }
  };
}])