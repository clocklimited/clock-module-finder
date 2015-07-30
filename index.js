var finder = require('./finder')()
  , api = require('./api.js')()
  , async = require('async')
  , npm = require('npm')

module.exports = function (options) {

  options = options || {}
  options.includeList = options.includeList || []

  var depStats = null

  function countDependencies(deps) {
    var depsList = deps.reduce(function (list, repoDeps) {
      for (var i = 0; i < repoDeps.length; i++) {
        var repo = repoDeps[i]
        list[repo] = (list[repo] ? list[repo] + 1 : 1)
      }
      return list
    }, {})

    return depsList;
  }

  function getDependenciesStats(cb) {
    finder.getUniqueClockRepos(function (err, repos) {
      if (err) return cb(err)
      async.map(repos, finder.getDependencies, function (err, deps) {
        if (err) return cb(err)
        console.log(deps.length)
        var depsList = countDependencies(deps)
        console.log(depsList)
        console.log(Object.keys(depsList).length)
        depStats = depsList
        return cb(null, depsList)
      })
    })
  }

  function loadNPM(deps, cb) {
    npm.load({}, function(){
      cb(null, deps)
    }) 
  }

  function getPackages(cb){ 
    async.waterfall(
      [ getDependenciesStats
      , loadNPM
      ]
    , function (err, results) {
        if (err) return cb(err)
        async.map(Object.keys(results), api.getPackageRepo, cb)
      }
    )
  }

  function findModules(options, cb) {
    options = options || {}
    options.includeList = options.includeList || []

    async.parallel(
      { packages: getPackages
      , members: finder.getClockMembersList
      }
    , function(err, res) {
        res.members = res.members.concat(options.includeList)
        var userModules = res.packages.filter(function(pack) {
          return (res.members.indexOf(pack.user) > -1)
        })
        .map(function(element) {
          element.count = depStats[element.packageName]
          return element
        })
        cb(null, userModules)
      }
    )
  }

  function showReport(err, res) {
    console.log('# Clock npm package leaderboard\n')
    if (err) return 
    for(var i = 0; i < res.length; i++) {
      if (res[i].user === 'clocklimited') continue
      // Remove git+, git:, .git from URLs
      var url = res[i].url.split('/').splice(-3).join('/')
      url = url.split('.git')[0]

      console.log(
        '[' + res[i].user + '/' + 
        res[i].packageName + '](https://' + url + ') has been used ' 
        + res[i].count + ' times.'
      )
    }
  }

  return {
    findModules: findModules
    , showReport: showReport
  }
}
