var express = require('express');
var fs = require('fs');
//var index = fs.readFileSync('index.html');

var app = express.createServer(express.logger());

//app.get('/', function(request, response) {
  //response.send('Hello World 2!');
fs.readFile('index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
app.get('/', function(request, response) {
//    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
//    }).listen(80);
});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
