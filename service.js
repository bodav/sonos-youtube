var youtube = require("./youtube");
var models = require("./models");
var winston = require("winston");

var sonosService = {
    Sonos: {
        SonosSoap: {

            getLastUpdate: function(args) {
                return { "catalog": "0", "favorites": "0" };
            },

            getMetadata: function(args, callback) {
                var id = deserializeId(args.id);

                if(id.prefix == models.ID_PREFIX.ROOT) {
                    //root view
                    payload = youtube.userchannel(function(mediaCollections, err) {
                        if(err != null) {
                            throw fault("", err);
                        }

                        mediaCollections.unshift(models.mediaCollection(models.ID_PREFIX.PLAYLISTS, null, "Playlists", ""));
                        mediaCollections.unshift(models.mediaCollection(models.ID_PREFIX.SUBSCRIPTIONS, null, "Subscriptions", ""));
                        callback(models.getMetadataResult(mediaCollections));
                    });
                    
                } else if(id.prefix == models.ID_PREFIX.PLAYLISTS) {
                    //Playlists
                    
                } else if(id.prefix == models.ID_PREFIX.PLAYLIST) {
                    //Playlist
                    
                } else if(id.prefix == models.ID_PREFIX.SUBSCRIPTIONS) {
                    //Subscriptions
                    
                } else if(id.prefix == models.ID_PREFIX.CHANNEL) {
                    //Channel
                    
                }
            },

            search: function(args) {
                return { };
            },

            getMediaMetadata: function(args) {
                return { };
            },

            getMediaURI: function(args) {
                return "test";
            }
        }
    }
};

function deserializeId(id) {
    var idParts = id.split(".");

    if(idParts.length == 2) {
        return { prefix: idParts[0],
            id: idParts[1] };
    } else {
        return { prefix: idParts[0] };
    }
}

function fault(code, reason) {
    winston.error(reason);
    //TODO...
    //http://musicpartners.sonos.com/node/460
    //throw fault("test", "test2");
    return { 
        Fault: {
            faultcode: "Server.ServiceUnknownError",
            faultstring: reason,
            detail: {
                ExceptionInfo: "",
                SonosError: 35
            },
            statusCode: 500
        }
    }
}

module.exports = sonosService;