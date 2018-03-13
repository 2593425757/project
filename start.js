var express = require('express');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json({limit: '1000mb'}));  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/index',function(req,res){
	res.set('Access-Control-Allow-Origin','*');
	res.sendFile(__dirname+'/index.html')
})
app.get('/',function(req,res){
	res.set('Access-Control-Allow-Origin','*');
	res.sendFile(__dirname+'/index.html')
})
app.post('/save',function(req,res){
	// console.log(req.body,req.file)
	res.end('ok')
})
app.use(express.static(__dirname+'/'))

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});