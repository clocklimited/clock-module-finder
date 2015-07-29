var finder = require('./finder')()
  , async = require('async')

module.exports = function () {
  function findModules(cb) {
    var actualPackages

    finder.getUniqueClockRepos(function (err, repos) {

      var possiblePackages = []
        , options

      async.forEach(repos, function (repo, callback) {

        options = {
          user: repo.login
        , repo: repo.repo
        }

        possiblePackages.concat(finder.getDependencies(options, callback))

      }, function(err) {

        if(err) throw new Error('Could not get possible packages')

        finder.getClockMemberList(function (err, members) {

          function memberPackages(element) {
            var repoUrlParts = element.split('/')
              , repoUser = repoUrlParts[repoUrlParts.length - 2]
            return members.indexOf(repoUser) > -1
          }

          actualPackages = possiblePackages.filter(memberPackages)

          cb(actualPackages)
        
        })

      })
    })
  }
  function showReport() {

  }

  return {
    findModules: findModules
  }
}
