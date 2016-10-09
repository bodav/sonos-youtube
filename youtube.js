var google = require("googleapis");
var winston = require("winston");
var config = require("./config.json");
var models = require("./models");

var youtube = google.youtube("v3");
var key = config.apikey;
var user_channel_id = undefined;

module.exports.userchannel = function(callback) {
    youtube.channels.list({ auth: key,
        part: "contentDetails",
        forUsername: config.youtube_user}, function(err, data) {
            
            var mediaCollections = [];
            user_channel_id = data.items[0].id;
            winston.info("User channel id: " + user_channel_id);
            
            var relatedPlaylists = data.items[0].contentDetails.relatedPlaylists;

            for (playlist in relatedPlaylists) {
                mediaCollections.push(models.mediaCollection(models.ID_PREFIX.PLAYLIST, 
                    relatedPlaylists[playlist], playlist, ""));
            }
            
            callback(mediaCollections, err);
    });
};

module.exports.channel = function(channelid) {

};

module.exports.userplaylists = function() {

};

module.exports.playlists = function(channelid) {

};

module.exports.playlist = function(playlistid) {

};

module.exports.usersubscriptions = function() {

};

module.exports.subscriptions = function(channelid) {

};

module.exports.searchvideos = function(term) {

};

module.exports.searchchannels = function(term) {

};

module.exports.searchplaylists = function(term) {

};

module.exports.video = function(videoid) {

};

function split_title(title) {

}
