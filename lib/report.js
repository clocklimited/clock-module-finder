module.exports = function () {
  function getReport(err, res) {
    if (err || res === undefined) throw new Error('Couldn\'t get report')
    res.sort(function(a, b) {
      return b.count - a.count
    })
    var report = '# Clock npm package leaderboard\n'
    report += '| Repository | Number of times used | Has david-dm | David-dm | \n'
    report += '|:-----------|:---------------------|:-------------|:----------| \n'
    for (var i = 0; i < res.length; i++) {
      if (res[i].user === 'clocklimited') continue
      report += '| [' + res[i].user + '/' + res[i].packageName + ']'
      report += '(https://github.com/' + res[i].user + '/' + res[i].repo + ') | ' + res[i].count + ' | '
      report += (res[i].david)  ? ' ✓ |' : ' ✘ |'
      report += '[![Dependencies Status](https://img.shields.io/david/' + res[i].user + '/' + res[i].repo
      report += '.svg)](https://david-dm.org/' + res[i].user + '/' + res[i].repo + ') |'
      report += '\n'
    }
    return report
  }
  return {
    get: getReport
  }
}
