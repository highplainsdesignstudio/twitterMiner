var Twitter = require('twitter');
var environment = require('./env_variables');
var fs = require('fs');
var sw = require('stopword');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});



module.exports = function(req, res, next) {
    console.log("Inside of twitter.js");
    console.log(req.query.term);
    
    var lat = req.query.geo.latitude;
    var long = req.query.geo.longitude;
    var dist = req.query.geo.distance;
    var r = /\S/;
    var geo = "";
    if (r.test(lat) && r.test(long) && r.test(dist)) {
        geo = lat + "," + long + "," + dist + "mi";
    }
    
    var queryObj = {
        q: req.query.term,
        count: 100,
        lang: 'en',
        geocode:  geo,
        result_type: req.query.resultType
    };
    client.get('search/tweets', queryObj, function(error, tweets, response) {
        
        var d = new Date();
        var fileName = 'bin/data/' + req.query.file + "_" + d.getFullYear() + "_" + d.getMonth() + "_" + d.getDate() + "_" + d.getHours() + d.getMinutes() + d.getSeconds() + ".json";
        
        var tweetText = {};
        for (let i=0; i < tweets.statuses.length; i++) {
            var temp = tweets.statuses[i].text.split(" ");
            var tempStrings = sw.removeStopwords(temp);
            for (let j=0; j < tempStrings.length; j++) {
                if (tweetText.hasOwnProperty(tempStrings[j])) {
                    tweetText[tempStrings[j]]++;
                } else {
                    tweetText[tempStrings[j]] = 1;
                }
            }
        }
        
        
        fs.writeFile(fileName, JSON.stringify(tweets, null, 1), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("file written");
                res.send({tweets: tweets, words: tweetText});
            }
        });
    });
};


