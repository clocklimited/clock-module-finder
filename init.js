var runFinder = require('./index.js')()

runFinder.findModules({ includeList: [ 'tomgco' ] }, runFinder.showReport)
