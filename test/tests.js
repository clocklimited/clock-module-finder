var Mocha = require('mocha')
  , assert = require('assert')
  , api = require('../api')()
  , mocha = new Mocha()

mocha.describe('module-finder', function() {

  mocha.describe('#getClockMembers', function() {
    mocha.it('should get the list of current Clock members', function(done) {
      api.getOrgMembers('clocklimited', function (members) {
        assert.equal((typeof members), 'object')
        assert.equal(members.length > 0, true)
        assert.equal(typeof members[0], 'object')
        assert.equal(typeof members[0].login, 'string')
        done()
      })

    })

    mocha.it.skip('should add non-Clock members from an include list', function () {
      // TODO: Implement include lists
      var includeList = ['maael']

      api.getOrgMembers('clocklimited', function (members) {
        var includedMembers = members.filter(function (member) {
          return mocha.excludeList.indexOf(member.login) > -1
        });

        assert.equal(includeList.length, includedMembers.length, 'Included members aren\'t returned')
      })
    })

   mocha.it.skip('should exclude Clock members from an exclude list', function () {
      // TODO: Implement exclude lists
      var excludeList = ['maael']

      api.getOrgMembers(function (members) {
        var excludedMembers = members.filter(function(member) {
          return excludeList.indexOf(member.login) > -1
        })

        assert.equal(excludedMembers.length, 0, 'Excluded members are returned')
      })
    })

  })

  mocha.describe('#getClockRepos', function() {
   mocha.it('should get the full list of Clock repos', function(done) {
      this.timeout(0)
      api.getTeamRepos({teamId: '152302'}, function(repos) {
        assert.equal(typeof repos, 'object', 'Repo list is an object')
        assert.equal(repos.length > 0, true, 'Repo list has repos in it')
        done()
      })
    })
  })

})
