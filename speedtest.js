

var redis = require('then-redis')
var db = redis.createClient()

//create som data
var value = {
	"name": "sdaskjndalkjdsölkajdölakjsasköjdlajk",
	"rating": 9,
	"when": Date.now(),
	"comment": "saidjsa daö jdlksajd ölaksjdö lajölkdja ölkjsaö jösalkjdölsakj ölkjsa öldkjsa öljsaö lkjdsaö" 
}
db.del('testlist').then(function(){
	var data = []
	for (var i=0; i<100000; i++) {
		data.push(JSON.stringify(value))
	}
	console.log(data.length)
	var start = Date.now()
	db.rpush('testlist',data).then(function(){
		var middle = Date.now()
		db.lrange('testlist',0,-1).then(function(result){
			var end = Date.now()
			console.log('set',middle-start,'get',end-middle)
			//console.log(result[0])
			//var dg = JSON.parse('['+result[0]+']');
			//console.log(dg)
		})
	})
})