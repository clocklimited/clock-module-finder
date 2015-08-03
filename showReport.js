var moduleFinder = require('./index.js')

moduleFinder.modules().find(
  { includeList: [ 'tomgco' ] }
, function (err, res) {
    console.log(moduleFinder.report().get(err, res))
  }
)

var finder = require('./lib/finder.js')()
finder.getDavid({ user: 'bag-man', repo: 'nodeup', file: 'README.md' }, function(err, res) {
  console.log('Does nodeup use david-dm? ' + res)
})

finder.getDavid({ user: 'clocklimited', repo: 'clock-module-finder', file: 'README.md' }, function(err, res) {
  console.log('Does clock-module-finder use david-dm? ' + res)
})
