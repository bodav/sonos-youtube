module.exports.getLastUpdateResult = function () {
    return {
        getLastUpdateResult: {
            catalog: "0", //getRandomInt(1, 9999),
            favorites: "0",
            pollInterval: 60
        }
    };
};

module.exports.mediaCollection = function (idPrefix, id, title, albumArtURI) {
    return {
        id: createId(idPrefix, id),
        title: capitalize(title),
        itemType: "container",
        albumArtURI: albumArtURI
    };
};

module.exports.getMetadataResult = function (mediaList, isMediaMetadata) {
    if (isMediaMetadata) {
        return {
            getMetadataResult: {
                index: 0,
                count: mediaList.length,
                total: mediaList.length,
                mediaMetadata: mediaList
            }
        };
    } else {
        return {
            getMetadataResult: {
                index: 0,
                count: mediaList.length,
                total: mediaList.length,
                mediaCollection: mediaList
            }
        };
    }
};

module.exports.mediaMetadata = function (idPrefix, id, title, trackMetadata) {
    return {
        id: createId(idPrefix, id),
        title: title,
        itemType: "track",
        mimeType: "audio/mp3",
        trackMetadata: trackMetadata
    };
};

module.exports.trackMetadata = function (artist, albumArtURI, duration) {
    return {
        artist: artist,
        albumArtURI: albumArtURI,
        album: "",
        genre: "",
        duration: duration
    };
};

module.exports.getMediaMetadataResult = function (mediaMetadata) {
    return {
        getMediaMetadataResult: mediaMetadata
    };
};

module.exports.searchResult = function (mediaList, isMediaMetadata) {
    if (isMediaMetadata) {
        return {
            searchResult: {
                index: 0,
                count: mediaList.length,
                total: mediaList.length,
                mediaMetadata: mediaList
            }
        };
    } else {
        return {
            searchResult: {
                index: 0,
                count: mediaList.length,
                total: mediaList.length,
                mediaCollection: mediaList
            }
        };
    }
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
    if (id == null) {
        finalId = prefix;
    } else {
        finalId = prefix + "." + id;
    }

    return finalId;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}