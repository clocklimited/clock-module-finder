var mocha = require('mocha')
  , assert = require('assert')
  , api = require('../api')()

describe('module-finder', function() {

  describe('#getClockMembers', function() {
    it('should get the list of current Clock members', function(done) {
      api.getOrgMembers('clocklimited', function (members) {
        assert.equal((typeof members), 'object')
        assert.equal(members.length > 0, true)
        assert.equal(typeof members[0], 'object')
        assert.equal(typeof members[0].login, 'string')
        done()
      })

    })

    it.skip('should add non-Clock members from an include list', function () {
      // TODO: Implement include lists
      var includeList = ['maael']

      api.getOrgMembers('clocklimited', function (members) {
        var includedMembers = members.filter(function (member) {
          return excludeList.indexOf(member.login) > -1
        });

        assert.equal(includeList.length, includedMembers.length, 'Included members aren\'t returned')
      })
    })

    it.skip('should exclude Clock members from an exclude list', function () {
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

  describe('#getClockRepos', function() {
    it('should get the full list of Clock repos', function(done) {
      this.timeout(0)
      api.getTeamRepos({teamId: '152302'}, function(repos) {
        assert.equal(typeof repos, 'object', 'Repo list is an object')
        assert.equal(repos.length > 0, true, 'Repo list has repos in it')
        done()
      })
    })
  })

})