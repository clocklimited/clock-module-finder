var assert = require('assert')
  , nock = require('nock')
  , finder = require('../lib/finder')()

describe('finder', function() {

  describe('Test that we are correctly getting the list of Clock repos', function () {
    describe('#getUniqueClockRepos', function () {
      it('gets unique clock repos', function (done) {

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/teams/152302/repos')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/clock-repos.json')

        finder.getUniqueClockRepos(function (err, repos) {
          assert.equal(repos.length, 46)
          assert.equal(repos[0].user, 'clocklimited')
          assert.equal(repos[0].repo, 'jshint-config')
          done()
        })

      })
    })
  })

  describe('Test that we are getting the list of clock members correctly', function () {
    describe('#getClockMembersList', function () {
      it('should get list of Clock members', function (done) {

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/orgs/clocklimited/members')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/members.json')

        finder.getClockMembersList([], function (err, members) {
          assert.equal(members.length, 13)
          assert.equal(members[0], 'ArnIIe')
          done()
        })

      })

      it('should get list of Clock members with members on include list as well', function (done) {

        nock('https://api.github.com')
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/orgs/clocklimited/members')
        .query({ page: 1, 'per_page': 100 })
        .replyWithFile(200, __dirname + '/responses/members.json')

        var includeList = [ 'serby' ]
        finder.getClockMembersList(includeList, function (err, members) {
          assert.equal(members[members.length - 1], 'serby',  'Included members aren\'t returned')
          done()
        })

      })
    })
  })
})
