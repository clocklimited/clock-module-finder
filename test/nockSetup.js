var nock = require('nock')

module.exports = function() {
  nock('https://api.github.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .persist()
  .get('/orgs/clocklimited/members')
  .query({ page: 1, 'per_page': 100 })
  .replyWithFile(200, __dirname + '/responses/members.json')

  nock('https://api.github.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .persist()
  .get('/repos/bag-man/process-game/contents/package.json')
  .replyWithFile(200, __dirname + '/responses/errorpackage.json')

  nock('https://api.github.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .persist()
  .get('/repos/maael/gw2-api-wrapper/contents/package.json')
  .replyWithFile(200, __dirname + '/responses/package.json')

  nock('https://api.github.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .get('/teams/152302/repos')
  .query({ page: 1, 'per_page': 100 })
  .replyWithFile(200, __dirname + '/responses/clock_repos.json')

  nock('https://api.github.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .persist()
  .get('/teams/152302/repos')
  .query({ page: 1, 'per_page': 100 })
  .replyWithFile(200, __dirname + '/responses/repos.json')

  nock('https://api.github.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .persist()
  .get('/users/tj/repos')
  .query({ page: 1, 'per_page': 100 })
  .replyWithFile(200, __dirname + '/responses/userrepos.json')

  console.log('Nock routes started')

  return nock
}

/* Test a nock route
var http = require('https')

http.get('https://api.github.com/teams/152302/repos?page=1&per_page=100', function(res) {
  var str = ''
  res.on('data', function(data) { str += data })
  res.on('end', function() {
    console.log(str)
  })
})
*/
