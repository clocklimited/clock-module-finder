var moduleFinder = require('./index.js')

moduleFinder.modules().find(
  { includeList: [ 'tomgco' ] }
, function (err, res) {
    console.log(moduleFinder.report().get(err, res))
  }
)
