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
            , david: false
            }
          ]
        , expectedReportLines = [
            '# Clock npm package leaderboard'
          , '| Repository | Number of times used | David-dm | '
          , '|:-----------|:---------------------|:---------| '
          ,  '| [serby/schemata](https://github.com/serby/schemata) | 38 |  ✘ |'
          , ''
          ]
        , reportText = report.get(null, reportTestData)
        assert.deepEqual(reportText.split('\n'), expectedReportLines, 'A correctly formatted report was not returned')
    })
  })
})
