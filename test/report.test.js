var assert = require('assert')
  , report = require('../lib/report')()

describe('report', function () {
  describe('Test that the markdown report (end result) is formed correctly', function () {
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
            , '| Repository | Number of times used | Has david-dm | David-dm | David-dm Dev | '
            , '|:-----------|:---------------------|:-------------|:---------|:-------------| '
            , '| [serby/schemata](https://github.com/serby/schemata) | 38 |  ✘ |[![Dependencies Status](https://img.shields.io/david/serby/schemata.svg)](https://david-dm.org/serby/schemata) |[![devDependencies Status](https://img.shields.io/david/serby/schemata/dev-status.svg)](https://david-dm.org/serby/schemata#info=devDependencies) |'
            , ''
            ]
          , reportText = report.get(null, reportTestData)
          assert.deepEqual(reportText.split('\n'), expectedReportLines, 'A correctly formatted report was not returned')
      })
    })
  })
})
