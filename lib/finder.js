var api = require('./api')()

module.exports = function () {

  function getUniqueClockRepos(cb) {
    var repoNames
      , notInList
      , languageCheck

    api.getRepos({ teamId: '152302' }, function (err, repos) {
      if (err) return cb(err)
      function getProbableJavaScriptRepos (list, repo) {
        notInList = (list.indexOf(repo.name) < 0)
        languageCheck = (repo.language === 'JavaScript' || repo.language === null)
        if (notInList && languageCheck) {
          list.push(
            { user: repo.owner.login
            , repo: repo.name
            }
          )
        }
        return list
      }
      repoNames = repos.reduce(getProbableJavaScriptRepos, [])
      cb(null, repoNames)
    })
  }

  function getClockMembersList(includeList, cb) {
    includeList = includeList || []
    api.getOrgMembers({ org: 'clocklimited' }, function (err, members) {
      if (err) return cb(err)
      var membersList = members.reduce(function (list, member) {
        list.push(member.login)
        return list
      }, [])
      membersList = membersList.concat(includeList)
      cb(null, membersList)
    })
  }

  function getDependencies(options, cb) {
    options.file = 'package.json'
    api.getFile(options, function (err, res) {
      if (err || !res.content) {
        // return cb(new Error('No package.json in ' + options.user + '/' + options.repo))
        return cb(null,[])
      } else {
        var data = JSON.parse(new Buffer(res.content, 'base64').toString())
          , dependencies = []
        if (data.dependencies) dependencies = dependencies.concat(Object.keys(data.dependencies))
        if (data.devDependencies) dependencies = dependencies.concat(Object.keys(data.devDependencies))
        cb(null, dependencies)
      }
    })
  }

  function getDavid(options, cb) {
    api.getReadMe(options, function (err, res) {
      if (err || !res.content) {
        options.david = false
        return cb(null, options)
      } else {
        var data = new Buffer(res.content, 'base64').toString()
        , found = (data.indexOf('david-dm') > -1) ? true : false
        options.david = found
        return cb(null, options)
      }
    })
  }

  return {
    getUniqueClockRepos: getUniqueClockRepos
  , getClockMembersList: getClockMembersList
  , getDependencies: getDependencies
  , getDavid: getDavid
  }
}
