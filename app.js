
var db  = require('then-redis').createClient()
var express = require('express')
var app = express()

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('cordova/www'));

app.get('/users', function(req, res){
  db.smembers('users').then(function(data){
    res.json({ users: data }) //wrap in object, arrays aren't safe
  },function(err){
    console.log('error',err)
    res.send(500)
  })
})

app.put('/users', function(req, res){
  if (req.body && req.body.name && req.body.name.trim() !== '') {
    db.sadd('users',req.body.name.trim())
    res.send(204)
  } else {
    res.send(500)
  }
})

app.delete('/users/:name', function(req, res){
  db.srem('users',req.params.name).then(function(){
    res.send(204)
  },function() {
    res.send(500)
  })

})


//get length of beer list
app.get('/beers/length', function(req, res){
  db.llen('beers').then(function(len){
    res.json(len)
  },function(){
    res.send(500)
  })
})



//get beers by range
app.get('/beers/:from', function(req, res){
  var from = parseInt(req.params.from,10)
  if (isNaN(from)) {
    res.send(500)
    return
  }
  res.setHeader('Content-Type', 'application/json');
  db.lrange('beers',from,-1).then(function(data){
    res.send('{ "beers": ['+data+']}') //wrap in object, arrays aren't safe
  },function(){
    res.send(500)
  })
})

//get all beers
app.get('/beers', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  db.lrange('beers',0,-1).then(function(data){
    res.send('{ "beers": ['+data+']}') //wrap in object, arrays aren't safe
  },function(){
    res.send(500)
  })
})

//add a beer or a diff
app.put('/beers', function(req, res){
  console.log('incoming beer',req.body)
  console.log(JSON.stringify(req.body))
  if (req.body && req.body.user && req.body.when) {
    db.rpush('beers',JSON.stringify(req.body))
    res.send(204)
  } else {
    res.send(500)
  }
})

app.listen(3000)
console.log('Server listening on http://localhost:3000')