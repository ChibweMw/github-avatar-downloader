var request = require('request');
var secrets = require('./secrets')

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request'
      Authorization: "9c310b03b5ce1ef57a0d354818d2181ee88d8448";
    },
  };

  request(url, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  console.log(("Result:", result));
});