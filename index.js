var finder = require('./finder')()
  , async = require('async')

module.exports = function () {
  function findModules(cb) {

    var actualPackages = []

    finder.getUniqueClockRepos(function (err, repos) {

      var possiblePackages = []
        , options

      async.map(repos, finder.getDependencies, function (err, deps) {
        var depsList = deps.reduce(function (list, repoDeps) {
          for (var i = 0; i < repoDeps.length; i++) {
            list[repoDeps[i]] ? list[repoDeps[i]] += 1 : list[repoDeps[i]] = 1
          }
          return list
        }, {})
      })

      //   possiblePackages.concat(finder.getDependencies(options, callback))

      // }, function(err) {
      //   console.log(2, err)

      //   //TODO Handle getDependecies error
      //   //if(err) cb(new Error('Could not get possible packages'))

      //   finder.getClockMembersList(function (err, members) {

      //     function memberPackages(element) {
      //       var repoUrlParts = element.split('/')
      //         , repoUser = repoUrlParts[repoUrlParts.length - 2]
      //       return members.indexOf(repoUser) > -1
      //     }

      //     actualPackages = possiblePackages.filter(memberPackages)
      //     console.log(3, possiblePackages)

      //     cb(null, actualPackages)
        
      //   })

      // })
    })
  }

  function showReport() {

  }

  return {
    findModules: findModules
  }
}
