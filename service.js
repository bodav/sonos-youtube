var sonosService = {
    Sonos: {
        SonosSoap: {

            getLastUpdate: function(args) {
                return { "catalog": "0", "favorites": "0" };
            },

            getMetadata: function(args) {

                if(args.id == "root") {
                    //root view
                    throw fault("test", "test2");

                } else {
                    //decode id
                }

                return { };
            },

            search: function(args) {
                return { };
            },

            getMediaMetadata: function(args) {
                return { };
            },

            getMediaURI: function(args) {
                return { };
            }
        }
    }
};

function fault(code, reason) {
    return { 
        Fault: {
            Code: { Value: code },
            Reason: { Text: reason }
        }
    }
}

module.exports = sonosService;