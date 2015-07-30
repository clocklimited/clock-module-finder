var finder = require('./finder')()
  , api = require('./api.js')()
  , async = require('async')
  , npm = require('npm')


module.exports = function() {
  function getDependenciesStats(cb) {
    finder.getUniqueClockRepos(function (err, repos) {
      if (err) return cb(err)
      async.map(repos, finder.getDependencies, function (err, deps) {
        if (err) return cb(err)
        var depsList = deps.reduce(function (list, repoDeps) {
          for (var i = 0; i < repoDeps.length; i++) {
            list[repoDeps[i]] ? list[repoDeps[i]] += 1 : list[repoDeps[i]] = 1
          }
          return list
        }, {})
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
        console.log(res)
        res.members = res.members.concat(options.includeList)
        var userModules = res.packages.filter(function(pack) {
          return (res.members.indexOf(pack.user) > -1)
        })
        console.log(userModules)
        cb(null, userModules)
      }
    )
  }

  function showReport() {

  }

  return {
    findModules: findModules
    , showReport: showReport
  }
}
