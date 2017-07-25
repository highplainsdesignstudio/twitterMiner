var Twitter = require('twitter');
var environment = require('./env_variables');
var fs = require('fs');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});



module.exports = function(req, res, next) {
    console.log("Inside of twitter.js");
    console.log(req.query.term);
    client.get('search/tweets', {q: req.query.term, count: 100}, function(error, tweets, response) {
        
        var d = new Date();
        var fileName = 'bin/data/' + req.query.file + "_" + d.getFullYear() + "_" + d.getMonth() + "_" + d.getDate() + "_" + d.getHours() + d.getMinutes() + d.getSeconds() + ".json";
        fs.writeFile(fileName, JSON.stringify(tweets, null, 1), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("file written");
                res.send(tweets);
            }
            
        });
    });
};


