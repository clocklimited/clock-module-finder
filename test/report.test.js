var assert = require('assert')
  , report = require('../lib/report')()

describe('report', function () {
  describe('#get', function () {
    it('should format report data into a markdown report', function () {
      var reportTestData = [
            { packageName: 'schemata'
            , user: 'serby'
            , url: 'git://github.com/serby/schemata.git'
            , repo: 'schemata'
            , count: 38
            }
          ]
        , expectedReport = [
            '# Clock npm package leaderboard'
          , '* [serby/schemata](https://github.com/serby/schemata) has been used 38 times.'
          , ''
          ]
        , reportText = report.get(null, reportTestData)
        assert.deepEqual(reportText.split('\n'), expectedReport, 'A correctly formated report was not returned')
    })
  })
})
