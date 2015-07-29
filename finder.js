var api = require('./api')()

function finder () {
  function getUniqueClockRepos(cb) {
    var repoNames
      , notInList
      , language

    api.getRepos({teamId: '152302'}, function (repos) {

      repoNames = repos.reduce(function (list, repo) {
        notInList = (list.indexOf(repo.name) < 0)
        language = (repo.language === 'JavaScript' || repo.language === null)
        if (notInList && language) {
          list.push({
            login: repo.owner.login
          , repo: repo.name
          })
        }
        return list
      }, [])

      cb(repoNames);
    })
  }

  function getClockMembersList(cb) {
    api.getOrgMembers({ org: 'clocklimited' }, function (members) {

      var membersList = members.reduce(function (list, member) {
        list.push(member.login)
        return list
      }, [])

      cb(membersList)
    })
  }

  function getDependencies(options, cb) {
    api.getPackageJson(options, function(err, res) {
      if (err || !res.content) {
        console.log('No package.json in ' + options.user + '/' + options.repo)
        return cb(err)
      } else {
        var data = JSON.parse(new Buffer(res.content, 'base64').toString())
        , dependencies = []
        if (data.dependencies) dependencies = dependencies.concat(Object.keys(data.dependencies))
        if (data.devDependencies) dependencies = dependencies.concat(Object.keys(data.devDependencies))
        cb(null, dependencies)
      }
    })
  }

  return {
    getUniqueClockRepos: getUniqueClockRepos
  , getClockMembersList: getClockMembersList
  , getDependencies: getDependencies
  }
}

finder().getDependencies({
  user: 'maael'
, repo: 'gw2-api-wrapper'
}, function(res) {
  console.log(res)
});

finder().getDependencies({
  user: 'bag-man'
, repo: 'process-game'
}, function(res) {
  console.log(res)
});
