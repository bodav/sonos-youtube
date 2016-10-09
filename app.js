var fs = require("fs");
var soap = require("soap");
var express = require('express');
var winston = require("winston");
var sonosService = require("./service");
var config = require("./config.json");

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: "debug",
    colorize: true,
    timestamp: true
});

var app = express();

var wsdl = fs.readFileSync('public/Sonos.wsdl', 'utf8');

app.use('/static', express.static('public'));

app.listen(config.server_port, function(){
    var sonossoap = soap.listen(app, '/soap', sonosService, wsdl);

    sonossoap.log = function(type, data) {
        winston.debug(type + ": " + data);
    };

    sonossoap.on("request", function(request, methodName) {
        winston.debug(methodName + ": " + request);
    });
});