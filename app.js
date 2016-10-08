var fs = require("fs");
var soap = require("soap");
var express = require('express');
var winston = require("winston");
var sonosService = require("./service");
var config = require("./config.json");

var app = express();

var wsdl = fs.readFileSync('public/Sonos.wsdl', 'utf8');

app.use('/static', express.static('public'));

app.listen(config.server_port, function(){
    var s = soap.listen(app, '/soap', sonosService, wsdl);

    s.log = function(type, data) {
        console.log(type + ": " + data);
    };

    s.on("request", function(request, methodName) {
        console.log(methodName + ": " + request);
    });
});