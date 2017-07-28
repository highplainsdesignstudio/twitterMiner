// Global variables
var hashTags = []; 
var usersCloud = [];
var wordCloud = [];
var embeddedTweetsIDs = [];

function getTweets() {
    // reset the clouds
    hashTags = [];
    usersCloud = [];
    wordCloud = [];
    embeddedTweetsIDs = [];
    $('#embedded-tweets').html('');
    
    // Obtain values from the inputs.
    var file = $("#search-name").val();
    var term = $("#search-term").val();
    var latitude = $("#search-latitude").val();
    var longitude = $("#search-longitude").val();
    var distance = $("#search-distance").val();
    var resultType = $("input[name='resultType']:checked").val();
    
    // Check that required inputs are filled out.
    if ((/\S/.test(term)) && (/\S/.test(file))) { 
        $('#search-name').val('');
        $('#search-term').val('');
        $('#word-cloud').jQCloud('destroy');


        // The parameters sent to the server.
        var params = {
            term: term,
            file: file,
            geo: {
                latitude: latitude,
                longitude: longitude,
                distance: distance
            },
            resultType: resultType
        };
        
        $.get('/getTweets', params, function(data) {
            console.log(data);
            $('#search-results').show()
                    .html("<p class='col-sm-4'>Found " + data.tweets.statuses.length + " statuses.</p>" +
                    "<p class='col-sm-4'>File Name: " + file + "</p>" +
                    "<p class='col-sm-4'>Query: " + term + '</p>');

            /*
             * Relevant variables for the word clouds. 
             */
            var hashtags = [];
            var users = {};
            
            /*
             * Cycle through statuses to extract the relevant variables. 
             */
            for (var i=0; i < data.tweets.statuses.length; i++) {
                // extract hashtags
                var tempHashtags = data.tweets.statuses[i].entities.hashtags;
                hashtags.push(tempHashtags);

                // extract user screen names
                if (users.hasOwnProperty(data.tweets.statuses[i].user.screen_name)) {
                    users[data.tweets.statuses[i].user.screen_name]++;
                } else {
                    users[data.tweets.statuses[i].user.screen_name] = 1;
                }
                
                embeddedTweetsIDs.push(data.tweets.statuses[i].id_str);
            }

            /*
             * Cycle through the hashtag entities to get the tags. 
             */
            var tempHashes = {};
            for (var j=0; j < hashtags.length; j++) {
                var temp = hashtags[j];
                for (var k=0; k < temp.length; k++) {
                    if (tempHashes.hasOwnProperty(temp[k].text)) {
                        tempHashes[temp[k].text]++;
                    } else {
                        tempHashes[temp[k].text] = 1;
                    }
                }
            }
 
            /*
             * Create the hashTags word set for the hashtags word cloud.
             */
            for(let word in tempHashes) {
                var wordObj = {
                    text: word,
                    weight: tempHashes[word],
                    html: {
                        title: tempHashes[word]
                    }
                };
                hashTags.push(wordObj);
            }
            
            /*
             * Create the userCloud word set for the user word cloud
             */
            for(let user in users) {
                var userObj = {
                    text: user,
                    weight: users[user],
                    html: {
                        title: users[user]
                    }
                };
                usersCloud.push(userObj);
            }
            
            /*
             * Create the textCloud with the words that are sent back 
             * from the server.
             */
            for (let word in data.words) {
                var textObj = {
                    text: word,
                    weight: data.words[word],
                    html: {
                        title: data.words[word] 
                    }
                };
                wordCloud.push(textObj);
            }
            
            
//            for (let i=0; i < embeddedTweetsIDs.length; i++) {
//                var id = '#tweet-' + i;
//                $('#embedded-tweets').append("<div id='"+id+"'></div>");
//            }
            
            /*
             * Set the initial word cloud to be the hashTags cloud.
             */
            $('#word-cloud').jQCloud(hashTags, {
                height: 750,
                autoResize: true,
                colors: ['red', 'orange', 'green', 'black'],
                fontSize: ['5em', '4em', '3em', '2em'],
                steps: 4
            });
            $('#get-tweets').show();
            
        });
    } else { 
        console.log("is null"); 
        $('#search-warning').show().fadeOut(5000);
    }
}

function userCloud() {
    $('#word-cloud').jQCloud('update', usersCloud);
}

function hashtagCloud() {
    $('#word-cloud').jQCloud('update', hashTags);
}

function textCloud() {
    $('#word-cloud').jQCloud('update', wordCloud);
}

function displayTweets() {
    console.log("DisplayTweets pressed.");
    for (let i=0; i < embeddedTweetsIDs.length; i++) {
        var id = 'tweet-' + i;
        $('#embedded-tweets').append("<div id='"+id+"' class='col-sm-6'></div>");
        $('#'+id).load('/embedTweets', {id: embeddedTweetsIDs[i]}, function() {
            console.log("Stuff");
            twttr.widgets.load();
        });
    }
}


