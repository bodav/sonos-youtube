var config = require("./config");

var google = require('googleapis');
var youtube = google.youtube("v3");

youtube.videos.list({ 
    "auth": config.apikey, 
    "part": "snippet,contentDetails",
    "id": "NHilrpLb-tI" }, function(err, data) {

        console.log(err);
        console.log(data);
});