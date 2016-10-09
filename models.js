
module.exports.getLastUpdateResult = function() {
    return {
        getLastUpdateResult: {
            catalog: getRandomInt(1, 9999),
            favorites: "0"
        }
    };
};

module.exports.mediaCollection = function(idPrefix, id, title, albumarturi) {
    return {
        id: createId(idPrefix, id),
        title: capitalize(title),
        itemType: "container",
        canCache: false,
        albumArtURI: albumarturi,
        canEnumerate: true,
        canScroll: false,
        canPlay: false
    };
};

module.exports.getMetadataResult = function(media) {
    if("trackMetadata" in media) {
        return { getMetadataResult: {
            index: 0, 
            count: media.length, 
            total: media.length, 
            mediaMetadata: media
        } };
    } else {
        return { getMetadataResult: {
            index: 0, 
            count: media.length, 
            total: media.length, 
            mediaCollection: media
        } };
    }
}

module.exports.mediaMetadata = function(idPrefix, id, title, trackMetadata) {
    return {
        id: createId(idPrefix, id),
        title: title,
        itemType: "track",
        mimeType: "audio/acc",
        trackMetadata: trackMetadata
    };
};

module.exports.trackMetadata = function(artist, albumArtURI, duration) {
    return {
        artist: artist,
        albumArtURI: albumArtURI,
        album: "",
        genre: "",
        duration: duration,
        canPlay: true,
        canSkip: true,
        canAddToFavorites: false
    };
};

module.exports.ID_PREFIX = {
    ROOT: "root",
    PLAYLISTS: "playlists",
    PLAYLIST: "playlist",
    VIDEO: "video",
    SUBSCRIPTIONS: "subscriptions",
    CHANNEL: "channel",
    SEARCH_VIDEO: "searchVideo",
    SEARCH_ID: "searchId",
    SEARCH_CHANNEL: "searchChannel",
    SEARCH: "search"
};

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createId(prefix, id) {
    var finalId = "";
    if(id ==null) {
        finalId = prefix;
    } else {
        finalId = prefix + "." + id; 
    }

    return finalId;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}