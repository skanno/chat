var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 3000;

app.get('/' , function(req, res){
  res.send('hello world');
});

http.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});