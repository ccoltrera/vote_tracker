"use strict";

var express = require("express");
var app = express();

app.use(express.static('html'));
app.use(express.static('styles'));
app.use(express.static('files'));
app.use(express.static('scripts'));

app.get("/", function(request, response) {
  response.status(200);
  response.sendFile("/index.html");
});

app.get("/secret", function(request, response) {
  response.status(200);
  response.end("This is my secret place. Get out!");
});

app.get("*", function(request, response) {
  response.status(404);
  //response.send("404 Error. Woops!")
  response.sendFile("/404.html");
});

var server = app.listen(5000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Server initialized, listening at port 5000");

});
