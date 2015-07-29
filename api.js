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

  function getOrgMembers(options, cb) {
    options = options || {};
    options.data = options.data || []
    options.pageNumber = options.pageNumber || 1
    if(!options.org) throw new Error('Need an organisation name to get members list')
    github.orgs.getMembers({
      org: options.org
    , page: options.pageNumber
    , per_page: 100
    }, function (err, res) {
      if(err) throw new Error('Could not get org members')
      options.data = options.data.concat(res)
      if(res.length === 100) {
        getNextPage(options, getOrgMembers, cb)
      } else {
        cb(options.data)
      }
    })
  }

  function getTeamRepos(options, cb) {
    options = options || {};
    options.data = options.data || []
    if(!options.teamId) throw new Error('Need a team id to get team repos')
    options.pageNumber = options.pageNumber || 1
    github.orgs.getTeamRepos({
      id: options.teamId
    , page: options.pageNumber
    , per_page: 100
    }, function(err, res) {
      if(err) throw new Error('Could not get team repos')
      options.data = options.data.concat(res)
      if(res.length === 100) {
        getNextPage(options, getTeamRepos, cb)
      } else {
        cb(options.data)
      }
    }) 
  }

  function getUserRepos(options, cb) {
    options = options || {}
    options.data = options.data || []
    if(!options.user) throw new Error('Need a username to get team repos')
    options.pageNumber = options.pageNumber || 1
    github.repos.getFromUser({
      user: options.user
    , page: options.pageNumber 
    , per_page: 100
    }, function(err, res) {
      if(err) throw new Error('Could not get user repos')
      options.data = options.data.concat(res)
      if(res.length === 100) {
        getNextPage(options, getUserRepos, cb)
      } else {
        cb(options.data)
      }
    }) 
  }

  function getPackageJson(options, cb) {
    options = options || {}
    if(!options.user || !options.repo) throw new Error('Need a username and repo to get package.json')
    github.repos.getContent({
      user: options.user
    , repo: options.repo
    , path: 'package.json'
    }, function(err, res) {
      if(err) throw new Error('Could not check for package.json')
      cb(res)
    }) 
  }

  function getNextPage(options, returnFunction, cb) {
    options.pageNumber += 1
    returnFunction(options, cb)
  }

  return {
    getOrgMembers: getOrgMembers
  , getTeamRepos: getTeamRepos
  , getUserRepos: getUserRepos
  , getPackageJson: getPackageJson
  }

}
