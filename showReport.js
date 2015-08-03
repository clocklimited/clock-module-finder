var moduleFinder = require('./index.js')
  , finder = require('./lib/finder.js')()
  , async = require('async')
  , fs = require('fs')

moduleFinder.modules().find(
  { includeList: [ 'tomgco' ] }
, function (err, res) {
    async.map(res, finder.getDavid, saveReport)
  }
)

function saveReport(err, res) {
  var fd = fs.openSync(__dirname + '/report.md', 'w')
  fs.writeSync(fd,moduleFinder.report().get(err, res))
}
