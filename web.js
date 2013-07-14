var express = require('express');
var fs = require('fs');
var index = fs.readFileSync('index.html');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  //response.send('Hello World 2!');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(index);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
