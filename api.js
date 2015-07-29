var GitHubApi = require('github')
  , passwords = require('./passwords.json')

module.exports = function() {
  var github = new GitHubApi({
    version: '3.0.0'
  })

  github.authenticate({
    type: 'token'
  , token: passwords.token 
  }) 

  function getOrgMembers(team, cb) {
    github.orgs.getMembers({
      org: 'clocklimited' // Team Clock
    }, function (err, res) {
      if(err) throw new Error('Could not get org members')
      cb(res)
    })
  }
  function getTeamRepos(options, cb) {
    var options = options || {};
    if(!options.teamId) throw new Error('Need a team id to get team repos')
    options.pageNumber = options.pageNumber || 1;

    github.orgs.getTeamRepos({
      per_page: 100
    , page: options.pageNumber
    , id: options.teamId
    }, function(err, res) {
      if(err) throw new Error('Could not get team repos')
      cb(res)
    }) 
  }
  function getUserRepos(username, cb) {
    github.repos.getFromUser({
      per_page: 100
    , page: 1
    , user: username 
    }, function(err, res) {
      if(err) throw new Error('Could not get user repos')
      cb(res)
    }) 
  }
  function getPackageJson(username, repoName, cb) {
    github.repos.getContent({
      user: username
    , repo: repoName
    , path: 'package.json'
    }, function(err, res) {
      if(err) throw new Error('Could not check for package.json')
      cb(res)
    }) 
  }

  return {
    getOrgMembers: getOrgMembers
  , getTeamRepos: getTeamRepos
  , getUserRepos: getUserRepos
  , getPackageJson: getPackageJson
  }

}