var assert = require('assert')
  , api = require('../lib/api')()
  , npm = require('npm')
  , nock = require('nock')

describe('api', function () {
  describe('Test calls to github API for organisation members', function () {
    describe('#getOrgMembers', function () {
      it('should get multiple pages of members for nodejs', function (done) {
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/orgs/nodejs/members')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/nodejs-users1.json')

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/orgs/nodejs/members')
        .query({ page: 2, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/nodejs-users2.json')

        api.getOrgMembers({ org: 'nodejs' }, function (err, members) {
          assert.equal(members.length === 147, true, 'Has got all pages')
          done()
        })
      })

      it('should get the list of current Clock members', function (done) {
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/orgs/clocklimited/members')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/members.json')

        api.getOrgMembers({ org: 'clocklimited' }, function (err, members) {
          assert.equal(members.length === 13, true, 'should return 28 members')
          assert.equal(members[0].login === 'ArnIIe', true, 'should return ArnIIe as first member')
          done()
        })
      })
    })
  })

  describe('Test calls to github API for organisation and user repositories', function () {
    describe('#getClockRepos', function () {
      it('should get the short list of Clock repos', function (done) {
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/teams/152302/repos')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/clock-repos.json')

        api.getRepos({ teamId: '152302', type: 'private' }, function(err, repos) {
          assert.equal(repos[0].name === 'jshint-config', true, 'expected first repo to be jshint-config')
          assert.equal(repos.length === 58, true, 'should return 58 repos')
          done()
        })
      })

      it('should get the multiple pages of google repos', function (done) {
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/teams/7378196/repos')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/google-repos1.json')

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/teams/7378196/repos')
        .query({ page: 2, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/google-repos2.json')

        api.getRepos({ teamId: '7378196' }, function (err, repos) {
          assert.equal(repos.length === 160, true, 'Has not used multiple pages')
          done()
        })
      })
    })

    describe('#getUserRepos', function () {
      it('should get list of repos', function (done) {
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/users/tj/repos')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/user-repos.json')

        api.getRepos({ user: 'tj' }, function (err, repos) {
          assert.equal(repos.length === 99, true, 'Expected 99 repos')
          assert.equal(repos[0].name === 'array', true, 'expected first repo to be array')
          done()
        })
      })

      it('should get multiple pages of tj\'s repos', function (done) {
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/users/tj/repos')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/user-repos1.json')

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/users/tj/repos')
        .query({ page: 2, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/user-repos2.json')

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
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/repos/maael/gw2-api-wrapper/contents/package.json')
        .replyWithFile(200, __dirname + '/responses/package.json')

        api.getPackageJson({ user: 'maael', repo: 'gw2-api-wrapper' }, function (err, packageJson) {
          assert.equal(packageJson.name, 'package.json', 'package.json not found')
          assert.equal(typeof packageJson.content, 'string', 'No content in file')
          done()
        })
      })
    })

    describe('#getPackageRepo', function () {
      // nock.recorder.rec()
      it('should get the repo of the package', function (done) {
        nock('http://npm.clockte.ch:80')
        .persist()
        .get('/mocha')
        .replyWithFile(304, __dirname + '/responses/npm-mocha.json')

        /*
        nock('https://registry.npmjs.org:443')
        .persist()
        .get('/mocha')
        .replyWithFile(304, __dirname + '/responses/npm-mocha.json') */

        npm.load({}, function () {
          api.getPackageRepo('mocha', function (err, packageRepo) {
            // Perform tests here.
            console.log(packageRepo)
            done()
          })
        })
      })
      // console.log(nock.recorder.play())
    })
  })
})
