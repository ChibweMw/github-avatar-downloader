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

  request(options, function(err, res, body) {
    var contributors = JSON.parse(body);
    cb(err, contributors);
  });
}

function downloadImageByURL(url, filePath) {
  //
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

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");

function testDownload(url, filePath) {
  console.log(url);
  console.log(filePath);
}

getRepoContributors("jquery", "jquery", function (err, contributors) {
  if(err) {
    console.log("Errors:", err);
  } else {
    contributors.forEach(function(contributor) {
      var path = "avatars/" + contributor.login + ".jpg";
      testDownload(contributor.avatar_url, path);
    })
  }
});