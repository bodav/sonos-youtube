var youtube = require("./youtube");
var util = require("util");
var moment = require("moment");

var chanId = "UClbUXgr0CtGr7QMTmlflmhw";
var playlistId = "PL822W9eQb6MkTMdbuIcK56X5Daba-wJrA";
var videoId = "8Xk7EaN4OHo";
var videoIds = ["8Xk7EaN4OHo", "yGRCPeoZ8wE"];

// youtube.video(videoId, function (data, err) {
//     console.log(util.inspect(data, false, null));
//     console.log(util.inspect(err, false, null));
// });

//PT59M50S

var time = moment.duration("PT59M50S").asSeconds();

console.log(time);

//youtube-dl --id -x --audio-format mp3 --fixup URL https://www.youtube.com/watch?v=rNGdQDyETuI