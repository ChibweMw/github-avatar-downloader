var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    },
  };

  request(options, function(err, res, contributorList) {
    //get the users and parse them into objects
    var contributors = JSON.parse(contributorList);
    //calling the callback of this function
    cb(err, contributors);
  });
}

function downloadImageByURL(url, filePath) {
  //checking the given url
  request.get(url)
  .on('error', function(err) {
    if(err) {
      console.log('error occured');
    }
  }).on('response', function(response) {
    console.log('Downloading...');
    console.log('Response status message:', response.statusMessage, response.headers['content-type']);
  }).on('end', function() {
    console.log('Download Complete!');
  }).pipe(fs.createWriteStream(filePath))
}

getRepoContributors("jquery", "jquery", function (err, contributors) {
  if(err) {
    console.log("Errors:", err);
  } else {
    contributors.forEach(function(contributor) {
      //concatenating the file path out of the user loging and other relevant strings
      var path = "avatars/" + contributor.login + ".jpg";
      //calling function to download avatar, one user at a time
      downloadImageByURL(contributor.avatar_url, path);
    })
  }
});