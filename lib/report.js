module.exports = function () {
  function getReport(err, res) {
    if (err || res === undefined) throw new Error('Couldn\'t get report')
    res.sort(function(a, b) {
      return b.count - a.count
    })
    var report = '# Clock npm package leaderboard\n'
    for (var i = 0; i < res.length; i++) {
      if (res[i].user === 'clocklimited') continue
      report += '* [' + res[i].user + '/' + res[i].packageName + ']'
      report += '(https://github.com/' + res[i].user + '/' + res[i].repo + ') has been used ' + res[i].count + ' times.'
      report += '\n'
    }
    return report
  }
  return {
    get: getReport
  }
}
