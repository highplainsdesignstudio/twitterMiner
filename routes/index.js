var express = require('express');
var router = express.Router();
var twitterClient = require('../bin/twitter.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HPDS Twitter Miner' });
});

router.get('/getTweets', twitterClient, function(req, res, next) {
    console.log("Hello from /getTweets.");
    res.send("Here is some data.");
});

module.exports = router;
