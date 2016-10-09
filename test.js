var youtube = require("./youtube");

var chanId = "UClbUXgr0CtGr7QMTmlflmhw";
var playlistId = "PL822W9eQb6MkTMdbuIcK56X5Daba-wJrA"; 

// youtube.userchannel(function(data, err) {
//     console.log(data);
//     console.log(err);
// });

youtube.playlist(playlistId, function(data, err) {
     console.log(data);
     console.log(err);
});