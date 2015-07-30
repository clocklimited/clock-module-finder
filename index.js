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
        var depsList = countDependencies(deps)
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
    console.log('Generating report')
    if (err) return 
    for(var i = 0; i < res.length; i++) {
      console.log('Package Name: ' + res[i].packageName)
    }
  }

  return {
    findModules: findModules
    , showReport: showReport
  }
}
