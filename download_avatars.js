var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');
var avatarOwner = process.argv[2];
var avatarRepoName = process.argv[3];

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
    console.log('Response status message:', response.statusMessage, response.headers['content-type']); //seeing if server is open for request
    console.log('Downloading...'); //download begins
  }).on('end', function() {
    console.log('Download Complete!'); //sends message once download is complete upon end of writable stream
  }).pipe(fs.createWriteStream(filePath)); //downloads requested file to specified file path
}

getRepoContributors(avatarOwner, avatarRepoName, function (err, contributors) {
  if(err) {
    //logs an error before running callback when necessary
    console.log("Errors:", err);
  } else {
      if(!avatarOwner && !avatarRepoName) {
        console.log("Error: Please specify repo owner and repo name.");
      } else {
        contributors.forEach(function(contributor) {
        //concatenating the file path out of the user loging and other relevant strings
        var path = "avatars/" + contributor.login + ".jpg";
        //calling function to download avatar, one user at a time
        downloadImageByURL(contributor.avatar_url, path);
        });
      }
  }
});