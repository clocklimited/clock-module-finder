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

  return {
    getUniqueClockRepos: getUniqueClockRepos
  , getClockMembersList: getClockMembersList
  }
}