var finder = require('./finder')()
  , async = require('async')

module.exports = function () {
  function findModules(cb) {

    var actualPackages = []

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
        console.log(err)

        //TODO Handle getDependecies error
        //if(err) cb(new Error('Could not get possible packages'))

        finder.getClockMembersList(function (err, members) {

          function memberPackages(element) {
            var repoUrlParts = element.split('/')
              , repoUser = repoUrlParts[repoUrlParts.length - 2]
            return members.indexOf(repoUser) > -1
          }

          actualPackages = possiblePackages.filter(memberPackages)
          console.log(possiblePackages)

          cb(null, actualPackages)
        
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
