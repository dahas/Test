var express = require("express");
var app = express();

var logger = function(req, res, next) {
    console.log("Log: ", req);
    next();
};

var hello = function(req, res, next) {
    res.setHeader("Content-Type", "text/plain");
    res.end("HELLO!!!");
    //next();
};

app.use(logger, hello);

app.listen(8080, function() {
    console.log(">>> Server running on localhost:8080 <<<")
});