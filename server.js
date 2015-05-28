"use strict"; //something about using ES5 vs ES6?

var http = require("http");
var fs = require("fs");

function onRequest(request, response) {

  if (request.method == "GET" && request.url == "/") {
    response.writeHead("200", {"Content-Type": "text/html"});
    fs.createReadStream("../vote_tracker/index.html").pipe(response);
  }
  else if (request.method == "GET" && request.url == "/normalize.css") {
    response.writeHead("200", {"Content-Type": "text/css"});
    fs.createReadStream("../vote_tracker/normalize.css").pipe(response);
  }
  else if (request.method == "GET" && request.url == "/skeleton.css") {
    response.writeHead("200", {"Content-Type": "text/css"});
    fs.createReadStream("../vote_tracker/skeleton.css").pipe(response);
  }
  else if (request.method == "GET" && request.url == "/style.css") {
    response.writeHead("200", {"Content-Type": "text/css"});
    fs.createReadStream("../vote_tracker/style.css").pipe(response);
  }
  else if (request.method == "GET" && request.url == "/Rock_Salt/RockSalt.ttf") {
    response.writeHead("200", {"Content-Type": "text/ttf"});
    fs.createReadStream("../vote_tracker/Rock_Salt/RockSalt.ttf").pipe(response);
  }
  else if (request.method == "GET" && request.url == "/script.js") {
    response.writeHead("200", {"Content-Type": "text/javascript"});
    fs.createReadStream("../vote_tracker/script.js").pipe(response);
  }
  else {
    response.writeHead("404", {"Content-Type": "text/plain"});
    response.end("404 File Not Found");
    console.log(request.url);
  }

}

var server = http.createServer(onRequest).listen(3000);

console.log("Server initialized, running on port 3000");
