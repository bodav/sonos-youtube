var youtube = require("./youtube");
var models = require("./models");
var winston = require("winston");
var util = require("util");
var config = require("./config.json");

var sonosService = {
    Sonos: {
        SonosSoap: {

            getLastUpdate: function (args) {
                return models.getLastUpdateResult();
            },

            getMetadata: function (args, callback) {
                var id = deserializeId(args.id);
                winston.info("Deserialized id: " + util.inspect(id));

                if (id.prefix == models.ID_PREFIX.ROOT) {
                    //root view
                    youtube.userChannel(function (mediaCollections, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        mediaCollections.unshift(models.mediaCollection(models.ID_PREFIX.PLAYLISTS, null, "Playlists", ""));
                        mediaCollections.unshift(models.mediaCollection(models.ID_PREFIX.SUBSCRIPTIONS, null, "Subscriptions", ""));
                        callback(models.getMetadataResult(mediaCollections, false));
                    });

                } else if (id.prefix == models.ID_PREFIX.PLAYLISTS) {
                    //Playlists
                    youtube.userPlaylists(function (mediaCollections, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.getMetadataResult(mediaCollections, false));
                    });

                } else if (id.prefix == models.ID_PREFIX.PLAYLIST) {
                    //Playlist
                    youtube.playlist(id.id, function (mediaMetadatas, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.getMetadataResult(mediaMetadatas, true));
                    });

                } else if (id.prefix == models.ID_PREFIX.SUBSCRIPTIONS) {
                    //Subscriptions
                    youtube.userSubscriptions(function (mediaCollections, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.getMetadataResult(mediaCollections, false));
                    });

                } else if (id.prefix == models.ID_PREFIX.CHANNEL) {
                    //Channel
                    youtube.channel(id.id, function (mediaCollections, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.getMetadataResult(mediaCollections, false));
                    });
                }
            },

            search: function (args, callback) {
                winston.info("search: " + util.inspect(args));

                if (args.term.slice(-1) != "?") {
                    callback(models.searchResult([], false));
                    return;
                }

                var term = args.term.substring(0, args.term.length - 1);

                winston.info("searching for: " + term);

                if (args.id == "tracks") {
                    youtube.searchVideos(term, function (mediaMetadatas, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.searchResult(mediaMetadatas, true));
                    });
                } else if (args.id == "playlists") {
                    youtube.searchPlaylists(term, function (mediaList, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.searchResult(mediaList, false));
                    });
                } else if (args.id == "people") {
                    youtube.searchChannels(term, function (mediaList, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.searchResult(mediaList, false));
                    });
                } else if (args.id == "tags") {
                    youtube.video(term, function (mediaMetadata, err) {
                        if (err != null) {
                            callback(fault(err));
                        }

                        callback(models.searchResult(mediaMetadata, true));
                    });
                } else {
                    callback(fault("", "search type not supported!"));
                }
            },

            getMediaMetadata: function (args, callback) {
                var id = deserializeId(args.id);

                youtube.video(id.id, function (mediaMetadata, err) {
                    if (err != null) {
                        callback(fault(err));
                    }

                    callback(models.getMediaMetadataResult(mediaMetadata));
                });
            },

            getMediaURI: function (args, callback) {
                winston.info("getMediaURI");
                var id = deserializeId(args.id);
                return { getMediaURIResult: config.mediaServer + id.id };
            }
        }
    }
};

function deserializeId(id) {
    var idParts = id.split(".");

    if (idParts.length == 2) {
        return {
            prefix: idParts[0],
            id: idParts[1]
        };
    } else {
        return {
            prefix: idParts[0]
        };
    }
}

function fault(reason) {
    winston.error(util.inspect(reason));

    return {
        Fault: {
            faultcode: "Server.ServiceUnknownError",
            faultstring: reason,
            // detail: {
            //     ExceptionInfo: "",
            //     SonosError: 35
            // },
            statusCode: 500
        }
    }
}

module.exports = sonosService;