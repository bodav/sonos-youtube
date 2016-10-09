var google = require("googleapis");
var winston = require("winston");
var config = require("./config.json");
var models = require("./models");

var youtube = google.youtube("v3");
var key = config.apikey;
var userChannelId = undefined;

module.exports.userChannel = function(callback) {
    youtube.channels.list({ auth: key,
        part: "contentDetails",
        maxResults: 50,
        forUsername: config.youtube_user}, function(err, data) {
            
            var mediaCollections = [];
            userChannelId = data.items[0].id;
            winston.info("User channel id: " + userChannelId);
            
            var relatedPlaylists = data.items[0].contentDetails.relatedPlaylists;

            for (playlist in relatedPlaylists) {
                mediaCollections.push(models.mediaCollection(models.ID_PREFIX.PLAYLIST, 
                    relatedPlaylists[playlist], playlist, ""));
            }
            
            callback(mediaCollections, err);
    });
};

module.exports.channel = function(channelId, callback) {

};

module.exports.userPlaylists = function(callback) {
    module.exports.playlists(userChannelId, callback);
};

module.exports.playlists = function(channelId, callback) {
    youtube.playlists.list({auth: key,
        part: "snippet",
        maxResults: 50,
        channelId: channelId}, function(err, data){
            var mediaCollections = [];

            for(item in data.items) {
                mediaCollections.push(models.mediaCollection(models.ID_PREFIX.PLAYLIST, 
                    data.items[item].id, data.items[item].snippet.title, 
                    getBestThumbnail(data.items[item].snippet)));
            }

            callback(mediaCollections, err);
        }); 
};

module.exports.playlist = function(playlistId, callback) {
    youtube.playlistItems.list({ auth: key,
        part: "snippet",
        maxResults: 50,
        playlistId: playlistId}, function(err, data) {
            var mediaMetadatas = [];

            for(item in data.items) {
                if(data.items[item].snippet.resourceId.kind == "youtube#video") {
                    artistAndTitle = splitTitle(data.items[item].snippet.title);

                    mediaMetadatas.push(models.mediaMetadata(models.ID_PREFIX.VIDEO, 
                        data.items[item].snippet.resourceId.videoId,
                        artistAndTitle.title,
                        models.trackMetadata(artistAndTitle.artist,
                            getBestThumbnail(data.items[item].snippet),
                            0)));
                }
            }

            callback(mediaMetadatas, err);
        });
};

module.exports.userSubscriptions = function(callback) {
    module.exports.subscriptions(userChannelId, callback);
};

module.exports.subscriptions = function(channelId, callback) {

};

module.exports.searchVideos = function(term, callback) {

};

module.exports.searchChannels = function(term, callback) {

};

module.exports.searchPlaylists = function(term, callback) {

};

module.exports.video = function(videoId, callback) {

};

function splitTitle(title) {
    var s = title.split(" - ");

    if(s.length > 1) {
        return { artist: s[0], title: s[1] };
    } else {
        return { artist: "", title: title };
    }
}

function getBestThumbnail(snippet) {
    var thumbs = snippet.thumbnails;

    if("high" in thumbs) {
        return thumbs.high.url;
    } else if("standard" in thumbs) {
        return thumbs.standard.url;
    } else if("default" in thumbs) {
        return thumbs.default.url;
    } else {
        return "";
    } 
}
