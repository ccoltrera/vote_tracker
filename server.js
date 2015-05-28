"use strict";

var express = require("express");
var app = express();

app.use(express.static('html'));
app.use(express.static('styles'));
app.use(express.static('files'));
app.use(express.static('scripts'));

app.get("/", function(request, response, next) {
  response.status(200);
  response.sendFile("/index.html");
});

app.get("/normalize.css", function(request, response, next) {
  response.status(200);
  response.sendFile("/normalize.css");
});

app.get("/skeleton.css", function(request, response, next) {
  response.status(200);
  response.sendFile("/skeleton.css");
});

app.get("/style.css", function(request, response, next) {
  response.status(200);
  response.sendFile("/style.css");
});

app.get("/Rock_Salt/RockSalt.ttf", function(request, response, next) {
  response.status(200);
  response.sendFile("/rock_salt/RockSalt.ttf");
});

app.get("/script.js", function(request, response, next) {
  response.status(200);
  response.sendFile("/script.js");
});

app.get("/secret", function(request, response, next) {
  response.status(200);
  response.end("This is my secret place. Get out!");
});

app.use(function(request, response, next) {
  response.status(404).sendFile('/404.html');
});



var server = app.listen(5000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Cutest Kitten Pageant listening at http://%s:%s', host, port);

});
