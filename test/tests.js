var assert = require('assert')
  , api = require('../api')()
  , finder = require('../finder')()
  , moduleFinder = require('../')()

/* Uncomment / comment for offline / online tests */
require('./nockSetup.js')()

describe('module-finder', function() {

  describe('#getClockMembers', function() {

    // Skipped as there is not a nock case
    it.skip('should get multiple pages of members for google', function(done) {
      this.timeout(0)
      api.getOrgMembers({ org: 'google' }, function (err, members) {
        assert.equal(members.length > 400, true, 'Has got all pages')
        done()
      })
    })

    it('should get the list of current Clock members', function(done) {
      api.getOrgMembers({ org: 'clocklimited' }, function (err, members) {
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

      api.getOrgMembers({ org: 'clocklimited' }, function (err, members) {
        var includedMembers = members.filter(function (member) {
          return includeList.indexOf(member.login) > -1
        });

        assert.equal(includeList.length, includedMembers.length, 'Included members aren\'t returned')
      })
    })

    it.skip('should exclude Clock members from an exclude list', function () {
      // TODO: Implement exclude lists
      var excludeList = ['maael']

      api.getOrgMembers(function (err, members) {
        var excludedMembers = members.filter(function(member) {
          return excludeList.indexOf(member.login) > -1
        })

        assert.equal(excludedMembers.length, 0, 'Excluded members are returned')
      })
    })

  })

  describe('#getDependencies', function() {
    it('should get an error object', function(done) {
      this.timeout(0)
      finder.getDependencies({ user: 'bag-man' , repo: 'process-game'}, function(err, res) {
        assert.equal(typeof err, 'object', 'No error reported for no package.json')
        assert.equal(res, null, 'Data reported')
        done()
      })
    })

    it('should get the full list of dependencies repos', function(done) {
      finder.getDependencies({ user: 'maael' , repo: 'gw2-api-wrapper'}, function(err, res) {
        var dependencyList = [
          'chai', 
          'chai-as-promised', 
          'chai-things', 
          'request', 
          'chai', 
          'chai-as-promised', 
          'chai-things', 
          'mocha']
        assert.deepEqual(res, dependencyList, 'Data is not the same')
        assert.equal(err, null, 'Error object found')
        done()
      })
    })
  })

  describe('#getClockRepos', function() {
    it('should get the short list of Clock repos', function(done) {
      this.timeout(0)
      api.getRepos({ teamId: '152302', type: 'private' }, function(err, repos) {
        assert.equal(typeof repos, 'object', 'Repo list is not an object')
        done()
      })
    })
    
    // Skipped as there isn't a nock case
    it.skip('should get the multiple pages of Clock repos', function(done) {
      this.timeout(0)
      api.getRepos({ teamId: '152302' }, function(err, repos) {
        assert.equal(typeof repos, 'object', 'Repo list is an object')
        assert.equal(repos.length > 100, true, 'Has not used multiple pages')
        done()
      })
    })
  })

  describe('#getUserRepos', function() {
    it('should get list of repos', function(done) {
      this.timeout(0)
      api.getRepos({ user: 'tj' }, function(err, repos) {
        assert.equal(typeof repos, 'object', 'Repo list is not an object')
        done()
      })
    })
    
    // Skipped as there isn't a nock case
    it.skip('should get multiple pages of tj\'s repos', function(done) {
      this.timeout(0)
      api.getRepos({ user: 'tj' }, function(err, repos) {
        assert.equal(typeof repos, 'object', 'Repo list is an object')
        assert.equal(repos.length > 100, true, 'Has not used multiple pages')
        done()
      })
    })
  })

})

describe('moduleFinder', function () {
  describe('#findModules', function () {
    it('should find modules', function (done) {
      this.timeout(0)
      moduleFinder.findModules(function (err, modules) {
        console.log(err)
        console.log(modules)
      })
    })
  })
})
