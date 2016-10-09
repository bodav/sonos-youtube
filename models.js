
//MediaCollection
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

module.exports.getMetadataResult = function(mediaCollections) {
    return { getMetadataResult: {
        index: 0, 
        count: mediaCollections.length, 
        total: mediaCollections.length, 
        mediaCollection: mediaCollections
    } };
}

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