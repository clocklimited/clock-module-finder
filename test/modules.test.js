var assert = require('assert')
  , nock = require('nock')
  , modules = require('../lib/modules')()

describe('modules', function () {
  describe('Test that we are correctly getting processing all of the data', function () {
    describe('#find', function () {
      it('should do something', function (done) {
        nock.disableNetConnect()

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/orgs/clocklimited/members')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/members.json')

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/teams/152302/repos')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/clock-repos.json')

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .filteringPath(function (path) {
          if (path.indexOf('package.json') > -1) return '/repos/aclockpacakage'
        })
        .get('/repos/aclockpacakage')
        .replyWithFile(200, __dirname + '/responses/clock-package.json')

        nock('http://npm.clockte.ch:80')
        .persist()
        .filteringPath(function() {
          return '/'
        })
        .get('/')
        .reply(304)

        nock('https://registry.npmjs.org:443')
        .persist()
        .filteringPath(function() {
          return '/'
        })
        .get('/')
        .reply(304)

        modules.find({}, function (err, modules) {
          assert.deepEqual(modules, [])
          assert.equal(err, null)
          done()
        })
      })

      it('should find modules including from those on the include list', function (done) {
        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/orgs/clocklimited/members')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/members.json')

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/teams/152302/repos')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/clock-repos.json')

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .filteringPath(function (path) {
          if (path.indexOf('package.json') > -1) return '/repos/aclockpacakage'
        })
        .get('/repos/aclockpacakage')
        .replyWithFile(200, __dirname + '/responses/clock-package.json')

        modules.find({ includeList: [ 'mochajs' ] }, function (err, modules) {
          assert.equal(modules[0].packageName, 'mocha')
          assert.equal(modules[0].user, 'mochajs')
          done()
        })
      })
    })
  })

  describe('Check that stats are being calculated correctly', function () {
    describe('#getStats', function () {
      it('should return stats of the found modules', function () {
        var stats = modules.getStats()
        assert.equal(stats.checkedRepos, 46)
      })
    })
  })
})
