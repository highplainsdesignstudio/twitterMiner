var express = require('express');
var router = express.Router();
var twitterClient = require('../bin/twitter.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HPDS Twitter Miner' });
});

router.get('/getTweets', twitterClient.getTweets, function(req, res, next) {
    console.log("You've gone too far!");
    res.send("There was an error?...");
});

router.post('/embedTweets', twitterClient.getEmbeddedTweets, function (req, res, next) {
    console.log("You've gone too far!");
    res.send("There was an error?...");
});

module.exports = router;
