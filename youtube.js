var google = require("googleapis");
var winston = require("winston");
var config = require("./config.json");
var models = require("./models");
var moment = require("moment");

var youtube = google.youtube("v3");
var key = config.apikey;
var userChannelId = undefined;

module.exports.userChannel = function (callback) {
    youtube.channels.list({
        auth: key,
        part: "contentDetails",
        maxResults: 50,
        forUsername: config.youtube_user
    }, function (err, data) {
        var mediaCollections = [];

        try {
            userChannelId = data.items[0].id;
            winston.info("User channel id: " + userChannelId);

            var relatedPlaylists = data.items[0].contentDetails.relatedPlaylists;

            for (playlist in relatedPlaylists) {
                mediaCollections.push(models.mediaCollection(models.ID_PREFIX.PLAYLIST,
                    relatedPlaylists[playlist], playlist, ""));
            }
        } catch (localErr) {
            callback(mediaCollections, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaCollections, err);
    });
};

module.exports.channel = function (channelId, callback) {
    youtube.channels.list({
        auth: key,
        part: "contentDetails",
        maxResults: 50,
        id: channelId
    }, function (err, data) {
        var mediaCollections = [];

        try {
            var relatedPlaylists = data.items[0].contentDetails.relatedPlaylists;

            for (playlist in relatedPlaylists) {
                mediaCollections.push(models.mediaCollection(models.ID_PREFIX.PLAYLIST,
                    relatedPlaylists[playlist], playlist));
            }
        } catch (localErr) {
            callback(mediaCollections, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaCollections, err);
    });
};

module.exports.userPlaylists = function (callback) {
    module.exports.playlists(userChannelId, callback);
};

module.exports.playlists = function (channelId, callback) {
    youtube.playlists.list({
        auth: key,
        part: "snippet",
        maxResults: 50,
        channelId: channelId
    }, function (err, data) {
        var mediaCollections = [];

        try {
            for (item in data.items) {
                mediaCollections.push(models.mediaCollection(models.ID_PREFIX.PLAYLIST,
                    data.items[item].id, data.items[item].snippet.title,
                    getBestThumbnail(data.items[item].snippet)));
            }
        } catch (localErr) {
            callback(mediaCollections, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaCollections, err);
    });
};

module.exports.playlist = function (playlistId, callback) {
    youtube.playlistItems.list({
        auth: key,
        part: "snippet",
        maxResults: 50,
        playlistId: playlistId
    }, function (err, data) {
        var mediaMetadatas = [];

        try {
            for (item in data.items) {
                if (data.items[item].snippet.resourceId.kind == "youtube#video") {
                    artistAndTitle = splitTitle(data.items[item].snippet.title);

                    mediaMetadatas.push(models.mediaMetadata(models.ID_PREFIX.VIDEO,
                        data.items[item].snippet.resourceId.videoId,
                        artistAndTitle.title,
                        models.trackMetadata(artistAndTitle.artist,
                            getBestThumbnail(data.items[item].snippet),
                            0)));
                }
            }
        } catch (localErr) {
            callback(mediaMetadatas, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaMetadatas, err);
    });
};

module.exports.userSubscriptions = function (callback) {
    module.exports.subscriptions(userChannelId, callback);
};

module.exports.subscriptions = function (channelId, callback) {
    youtube.subscriptions.list({
        auth: key,
        part: "snippet",
        channelId: channelId,
        maxResults: 50
    }, function (err, data) {
        var mediaCollections = [];

        try {
            for (item in data.items) {
                mediaCollections.push(models.mediaCollection(models.ID_PREFIX.CHANNEL,
                    data.items[item].snippet.resourceId.channelId,
                    data.items[item].snippet.title,
                    getBestThumbnail(data.items[item].snippet)));
            }

        } catch (localErr) {
            callback(mediaCollections, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaCollections, err);
    });
};

module.exports.searchVideos = function (term, callback) {
    youtube.search.list({
        auth: key,
        part: "snippet",
        type: "video",
        maxResults: 50,
        q: term
    }, function (err, data) {
        var mediaMetadatas = [];

        try {
            for (item in data.items) {
                artistAndTitle = splitTitle(data.items[item].snippet.title);

                mediaMetadatas.push(models.mediaMetadata(models.ID_PREFIX.VIDEO,
                    data.items[item].id.videoId,
                    artistAndTitle.title,
                    models.trackMetadata(artistAndTitle.artist,
                        getBestThumbnail(data.items[item].snippet),
                        0)));
            }
        } catch (localErr) {
            callback(mediaMetadatas, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaMetadatas, err);
    });
};

module.exports.searchChannels = function (term, callback) {
    youtube.search.list({
        auth: key,
        part: "snippet",
        type: "channel",
        maxResults: 50,
        q: term
    }, function (err, data) {
        var mediaList = [];

        try {
            for (item in data.items) {
                mediaList.push(models.mediaCollection(models.ID_PREFIX.CHANNEL,
                    data.items[item].id.channelId, data.items[item].snippet.title,
                    getBestThumbnail(data.items[item].snippet)));
            }
        } catch (localErr) {
            callback(mediaList, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaList, err);
    });
};

module.exports.searchPlaylists = function (term, callback) {
    youtube.search.list({
        auth: key,
        part: "snippet",
        type: "playlist",
        maxResults: 50,
        q: term
    }, function (err, data) {
        var mediaList = [];

        try {
            for (item in data.items) {
                mediaList.push(models.mediaCollection(models.ID_PREFIX.PLAYLIST,
                    data.items[item].id.playlistId, data.items[item].snippet.title,
                    getBestThumbnail(data.items[item].snippet)));
            }
        } catch (localErr) {
            callback(mediaList, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaList, err);
    });
};

module.exports.video = function (videoId, callback) {
    var reqVideoId = "";

    if (typeof (videoId) === "string") {
        reqVideoId = videoId;
    } else {
        reqVideoId = videoId.join();
    }

    youtube.videos.list({
        auth: key,
        part: "snippet,contentDetails",
        maxResults: 50,
        id: reqVideoId
    }, function (err, data) {
        var mediaMetadatas = [];

        try {
            for (item in data.items) {
                if (data.items[item].kind == "youtube#video") {
                    artistAndTitle = splitTitle(data.items[item].snippet.title);

                    mediaMetadatas.push(models.mediaMetadata(models.ID_PREFIX.VIDEO,
                        data.items[item].id,
                        artistAndTitle.title,
                        models.trackMetadata(artistAndTitle.artist,
                            getBestThumbnail(data.items[item].snippet),
                            moment.duration(data.items[item].contentDetails.duration).asSeconds())));
                }
            }
        } catch (localErr) {
            callback(mediaMetadatas, {
                youtubeErr: err,
                localErr: localErr
            });
            return;
        }

        callback(mediaMetadatas, err);
    });
};

function splitTitle(title) {
    var s = title.split(" - ");

    if (s.length > 1) {
        return {
            artist: s[0],
            title: s[1]
        };
    } else {
        return {
            artist: "",
            title: title
        };
    }
}

function getBestThumbnail(snippet) {

    if ("thumbnails" in snippet) {
        var thumbs = snippet.thumbnails;

        if ("high" in thumbs) {
            return thumbs.high.url;
        } else if ("standard" in thumbs) {
            return thumbs.standard.url;
        } else if ("default" in thumbs) {
            return thumbs.default.url;
        } else {
            return "";
        }
    } else {
        return "";
    }
}