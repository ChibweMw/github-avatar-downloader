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
    var repo = JSON.parse(body)
    cb(err, res, repo);
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

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");

/*getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  console.log(("Result:", result));
});*/