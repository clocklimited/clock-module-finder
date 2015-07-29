var GitHubApi = require('github')

var github = new GitHubApi({
  version: '3.0.0'
})

github.authenticate({
  type: 'token',
  token: '03e1c61ed78b2420026f593ca7f6054850950ec0'
})

github.orgs.getMembers({
  org: 'clocklimited'
}, function (err, res) {
  if (!err) {
    for(var i = 0; i < res.length; i++) {
      console.log((i+1) + '. ' + res[i].login)
    }
  } else {
    console.log(err)
  }
})

github.orgs.getTeamRepos({
  per_page: 100,
  page: 1,
  id: '152302' // Clocklimited's 'Clock' team ID
}, function(err, res) {
  if (!err) {
    for(var i = 0; i < res.length; i++) {
      console.log((i+1) + '. ' + res[i].name)
    }
  } else {
    console.log(err)
  }
}) 

github.repos.getFromUser({
  per_page: 100,
  page: 1,
  user: 'maael' 
}, function(err, res) {
  if (!err) {
    for(var i = 0; i < res.length; i++) {
      console.log((i+1) + '. ' + res[i].name)
    }
  } else {
    console.log(err)
  }
}) 

github.repos.getContent({
  user: 'bag-man',
  repo: 'nodeup',
  path: 'package.json'
}, function(err, res) {
  if (!err) {
    console.log(res)
  } else {
    console.log(err)
  }
}) 
