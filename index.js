var finder = require('./finder')()
  , api = require('./api.js')()
  , async = require('async')
  , npm = require('npm')

module.exports = function (options) {

  options = options || {}
  options.includeList = options.includeList || []

  var depStats = null
    , stats = {}

  function countDependencies(deps) {
    var depsList = deps.reduce(function (list, repoDeps) {
      stats.uncountedDeps = (stats.uncountedDeps ? stats.uncountedDeps + repoDeps.length : repoDeps.length)
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
      stats.checkedRepos = repos.length
      async.map(repos, finder.getDependencies, function (err, deps) {
        if (err) return cb(err)
        var depsList = countDependencies(deps)
        stats.countedDeps = Object.keys(depsList).length
        depStats = depsList
        return cb(null, depsList)
      })
    })
  }

  function loadNPM(deps, cb) {
    npm.load({}, function() {
      cb(null, deps)
    })
  }

  function getPackages(cb) {
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
      , members: finder.getClockMembersList.bind(null, options.includeList)
      }
    , function(err, res) {
        stats.numberOfMembers = res.members.length
        var userModules = res.packages.filter(function(pack) {
          return (res.members.indexOf(pack.user) > -1)
        })
        .map(function(element) {
          element.count = depStats[element.packageName]
          return element
        })
        stats.filteredModules = userModules.length
        cb(null, userModules)
      }
    )
  }

  function showReport(err, res) {
    res.sort(function(a, b) {
      return b.count - a.count;
    })
    var report = ''
    report += '# Clock npm package leaderboard\n'
    if (err) return
    for (var i = 0; i < res.length; i++) {
      if (res[i].user === 'clocklimited') continue
      report += '* [' + res[i].user + '/' + res[i].packageName + ']'
      report += '(https://github.com/' + res[i].user + '/' + res[i].repo + ') has been used ' + res[i].count + ' times.'
      report += '\n'
    }
    console.log(report)
  }

  function getStats () {
    return stats
  }

  return {
    findModules: findModules
    , showReport: showReport
    , getStats: getStats
  }
}
