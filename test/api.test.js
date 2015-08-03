var assert = require('assert')
  , api = require('../api')()
  , npm = require('npm')

describe('api', function () {
  describe('Test calls to github API for organisation members', function () {
    describe('#getOrgMembers', function () {
      it('should get multiple pages of members for nodejs', function (done) {
        this.timeout(0)
        api.getOrgMembers({ org: 'nodejs' }, function (err, members) {
          assert.equal(members.length === 147, true, 'Has got all pages')
          done()
        })
      })

      it('should get the list of current Clock members', function (done) {
        api.getOrgMembers({ org: 'clocklimited' }, function (err, members) {
          // TODO : change to check against static nock & specific length
          assert.equal((typeof members), 'object')
          assert.equal(members.length > 0, true)
          assert.equal(typeof members[0], 'object')
          assert.equal(typeof members[0].login, 'string')
          done()
        })
      })
    })
  })

  describe('Test calls to github API for organisation and user repositories', function () {
    describe('#getClockRepos', function () {
      it('should get the short list of Clock repos', function (done) {
        this.timeout(0)
        api.getRepos({ teamId: '152302', type: 'private' }, function(err, repos) {
          // check against expected values
          assert.equal(typeof repos, 'object', 'Repo list is not an object')
          done()
        })
      })

      it('should get the multiple pages of google repos', function (done) {
        this.timeout(0)
        api.getRepos({ teamId: '7378196' }, function (err, repos) {
          assert.equal(typeof repos, 'object', 'Repo list is an object')
          assert.equal(repos.length === 160, true, 'Has not used multiple pages')
          done()
        })
      })
    })

    describe('#getUserRepos', function () {
      it('should get list of repos', function (done) {
        this.timeout(0)
        api.getRepos({ user: 'tj' }, function (err, repos) {
          // more specific tests
          assert.equal(typeof repos, 'object', 'Repo list is not an object')
          done()
        })
      })

      it('should get multiple pages of tj\'s repos', function (done) {
        this.timeout(0)
        api.getRepos({ user: 'tj' }, function(err, repos) {
          assert.equal(typeof repos, 'object', 'Repo list is an object')
          assert.equal(repos.length === 120, true, 'Has not used multiple pages')
          done()
        })
      })
    })
  })

  describe('Test calls to NPM registry', function () {
    describe('#getPackageJson', function () {
      it('should get the package json for a repo', function (done) {
        api.getPackageJson({ user: 'maael', repo: 'gw2-api-wrapper' }, function (err, packageJson) {
          // more specific, check in package.json
          assert.equal(err, null, 'An error is returned')
          assert.equal(typeof packageJson, 'object', 'packageJson wasn\'t an object')
          done()
        })
      })
    })

    describe('#getPackageRepo', function () {
      it('should get the repo of the package', function (done) {
        // more specific
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
})
