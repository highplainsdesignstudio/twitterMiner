// Global variables
var hashTags = []; 
var usersCloud = [];
var wordCloud = [];
var embeddedTweetsIDs = [];
var pages = [];
var currentPage = 0;

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
        
        // the get request to the server to get the tweets.
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
            
            /*
             * Set the initial word cloud to be the hashTags cloud.
             */
            $('#word-cloud').jQCloud(hashTags, {
                height: 750,
                autoResize: true,
                colors: ['red', 'orange', 'green', 'black'],
                fontSize: ['5em', '4em', '3em', '2em'],
                steps: 4,
                shape: 'rectangular'
            });
            $('#get-tweets').show();
            
            createTweetPages();
            
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


function displayTweets(page) {
    
    currentPage = pages.indexOf(page);
    $("#tweets-area").empty();
    for (let i=0; i < page.length; i++) {
        var id = 'tweet-' + i;
        $('#tweets-area').append("<div id='"+id+"' class='col-sm-6'></div>");
        twttr.widgets.createTweet(page[i], document.getElementById(id));
    }
    
    for (let j=0; j < pages.length; j++) {
        $(".button-"+j).removeClass('btn-info btn-secodary');
        if (j===currentPage) {
            $(".button-"+j).addClass('btn-secondary');
        } else {
            $(".button-"+j).addClass('btn-info');
        }
    }

}

function createTweetPages () {
    var count = (embeddedTweetsIDs.length / 10);
    
    $("#embedded-tweets").append("<div id='pagination' class='row text-center'><button class='btn btn-danger col-1' onclick='displayTweets(pages[pageDown()])'><</button></div>");
    for (let i=0; i < count; i++) {
        var tempArray = embeddedTweetsIDs.slice((i*10), (i+1)*10 );
        pages.push(tempArray);
        $("#pagination").append("<button class='btn col-1 button-"+i+"' onclick='displayTweets(pages["+i+"])'>" + (i+1) + "</button");
    }
    $("#pagination").append("<button class='btn btn-danger col-1' onclick='displayTweets(pages[pageUp()])'>></button>");
    
    
    $("#embedded-tweets").append("<div id='tweets-area' class='row'></div>");
    
    $("#embedded-tweets").append("<div id='pagination1' class='row text-center'><button class='btn btn-danger col-1' onclick='displayTweets(pages[pageDown()])'><</button></div>");
    for (let i=0; i < count; i++) {
        var tempArray = embeddedTweetsIDs.slice((i*10), (i+1)*10 );
        pages.push(tempArray);
        $("#pagination1").append("<button class='btn col-1 button-"+i+"' onclick='displayTweets(pages["+i+"])'>" + (i+1) + "</button");
    }
    $("#pagination1").append("<button class='btn btn-danger col-1' onclick='displayTweets(pages[pageUp()])'>></button>");
    
    displayTweets(pages[0]);
}


function pageUp() {
    var nextPage = currentPage+1;
    if (nextPage >= pages.length) {
        nextPage = 0;
    }
    return nextPage;
}

function pageDown() {
    var nextPage = currentPage-1;
    if (nextPage < 0) {
        nextPage = pages.length-1;
    }
    return nextPage;
}
