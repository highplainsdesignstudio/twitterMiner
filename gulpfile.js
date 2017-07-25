/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var fs = require('fs');
var sw = require('stopword');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('tweet-text', function() {
    fs.readdir('bin/data', function(err, files) {
//        console.log(files);
        var textObject = {};
        
        for(var h=0; h < files.length; h++) {
            var data = fs.readFileSync('bin/data/' + files[h], 'utf8');
            var file = JSON.parse(data);
            var text = '';
            for (var i=0; i < file.statuses.length; i++) {
                text += file.statuses[i].text + '\n';
            }
            var tempWords = text.split(/\s+/);
            var words = sw.removeStopwords(tempWords);
            
            for (var j=0; j < words.length; j++) {
                if(textObject.hasOwnProperty(words[j])){
                    textObject[words[j]]++;
                } else {
                    textObject[words[j]] = 1;
                }
            }
        }
        
        fs.writeFile('bin/output/object.json', JSON.stringify(textObject, null, 2), function(err) {
            console.log("file written.");
        });
        
    });
});

