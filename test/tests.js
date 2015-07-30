var assert = require('assert')
  , api = require('../api')()
  , finder = require('../finder')()
  , moduleFinder = require('../')()
  , npm = require('npm')

/* Uncomment / comment for offline / online tests */
// require('./nockSetup.js')()

describe('api', function () {
  describe('#getOrgMembers', function () {
    // Skipped as there is not a nock case
    it.skip('should get multiple pages of members for google', function (done) {
      this.timeout(0)
      api.getOrgMembers({ org: 'google' }, function (err, members) {
        assert.equal(members.length > 400, true, 'Has got all pages')
        done()
      })
    })

    it('should get the list of current Clock members', function (done) {
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

  describe('#getRepos', function () {
      describe('#getClockRepos', function () {
      it('should get the short list of Clock repos', function (done) {
        this.timeout(0)
        api.getRepos({ teamId: '152302', type: 'private' }, function(err, repos) {
          assert.equal(typeof repos, 'object', 'Repo list is not an object')
          done()
        })
      })
      
      // Skipped as there isn't a nock case
      it.skip('should get the multiple pages of Clock repos', function (done) {
        this.timeout(0)
        api.getRepos({ teamId: '152302' }, function (err, repos) {
          assert.equal(typeof repos, 'object', 'Repo list is an object')
          assert.equal(repos.length > 100, true, 'Has not used multiple pages')
          done()
        })
      })  
    })

    describe('#getUserRepos', function () {
      it('should get list of repos', function (done) {
        this.timeout(0)
        api.getRepos({ user: 'tj' }, function (err, repos) {
          assert.equal(typeof repos, 'object', 'Repo list is not an object')
          done()
        })
      })
      
      // Skipped as there isn't a nock case
      it.skip('should get multiple pages of tj\'s repos', function (done) {
        this.timeout(0)
        api.getRepos({ user: 'tj' }, function(err, repos) {
          assert.equal(typeof repos, 'object', 'Repo list is an object')
          assert.equal(repos.length > 100, true, 'Has not used multiple pages')
          done()
        })
      })
    })
  })

  describe('#getPackageJson', function () {
    it('should get the package json for a repo', function (done) {
      api.getPackageJson({ user: 'maael', repo: 'gw2-api-wrapper' }, function (err, packageJson) {
        assert.equal(err, null, 'An error is returned')
        assert.equal(typeof packageJson, 'object', 'packageJson wasn\'t an object')
        done()
      })
    })
  })

  describe('#getPackageRepo', function () {
    it('should get the repo of the package', function (done) {
      npm.load({}, function () {
        api.getPackageRepo('mocha', function (err, packageRepo) {
          assert.equal(err, null, 'An error is returned')
          assert.equal(typeof packageRepo, 'object', 'PackageRepo wasn\'t an object')
          done()
        })
      })
    })
  })

})

describe('finder', function () {
  describe('#getDependencies', function () {
    it('should get an error object', function (done) {
      this.timeout(0)
      finder.getDependencies({ user: 'bag-man' , repo: 'process-game'}, function (err, res) {
        assert.equal(err, null, 'Error came back not as null')
        assert.equal(res.length, 0, 'There is data being returned')
        done()
      })
    })

    it('should get the full list of dependencies repos', function (done) {
      finder.getDependencies({ user: 'maael' , repo: 'gw2-api-wrapper'}, function (err, res) {
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
})

describe('moduleFinder', function () {
  describe('#findModules', function () {
    it('should find modules', function (done) {
      this.timeout(0)
      moduleFinder.findModules({includeList: ['request']}, function (err, modules) {
        assert.equal(modules.length > 0, true, 'Modules has no elements')
        done()
      })
    })
  })
})

describe('showReport', function () {
  describe('#showReport', function () {
    it('should display report of data', function (done) {
      this.timeout(0)
      moduleFinder.findModules({includeList: ['request']}, moduleFinder.showReport) 
      done()
    })
  })
})
