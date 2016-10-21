var fs = require("fs");
var soap = require("soap");
var express = require('express');
var winston = require("winston");
var util = require("util");
var sonosService = require("./service");
var config = require("./config.json");

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: "debug",
    colorize: true,
    timestamp: true
});

var app = express();

winston.info("Reading sonos wsdl...");
var wsdl = fs.readFileSync('public/Sonos.wsdl', 'utf8');

app.use('/static', express.static('public'));

app.listen(config.serverPort, function () {
    var sonossoap = soap.listen(app, '/soap', sonosService, wsdl);

    sonossoap.log = function (type, data) {
        winston.debug(type + ": " + data);
    };

    sonossoap.on("request", function (request, methodName) {
        winston.debug(methodName + ": " + util.inspect(request));
    });
});

winston.info("Server started on port: " + config.serverPort);