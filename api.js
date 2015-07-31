var GitHubApi = require('github')
  , passwords = process.env.GITHUB || require('./passwords.json')
  , npm = require('npm')

  console.log(process.env)

module.exports = function() {
  var github = new GitHubApi({
    version: '3.0.0'
  })

  github.authenticate({ type: 'token', token: passwords.token })

  function getOrgMembers(options, cb) {
    options = options || {}
    options.data = options.data || []
    options.pageNumber = options.pageNumber || 1
    if (!options.org) throw new Error('Need an organisation name to get members list')
    github.orgs.getMembers(
      { org: options.org
      , page: options.pageNumber
      , 'per_page': 100 // To adhere to JShintrc
      }
      , function (err, res) {
        if (err) return cb(err)
        options.data = options.data.concat(res)
        if (res.length === 100) {
          getNextPage(options, getOrgMembers, cb)
        } else {
          cb(null, options.data)
        }
      }
    )
  }

  function getRepos(options, cb) {
    function handleResponse(err, res) {
      if (err) return cb(err)
      options.data = options.data.concat(res)
      if (res.length === 100) {
        getNextPage(options, getRepos, cb)
      } else {
        cb(null, options.data)
      }
    }

    options = options || {}
    options.data = options.data || []
    if (!options.user && !options.teamId) {
      return cb(new Error('Need a username or team id to get repos'))
    }
    options.pageNumber = options.pageNumber || 1

    var githubOptions =
        { page: options.pageNumber
        , 'per_page': 100 // To adhere to JShintrc
        }
    if (options.teamId) {
      githubOptions.id = options.teamId
      github.orgs.getTeamRepos(githubOptions, handleResponse)
    } else {
      githubOptions.user = options.user
      github.repos.getFromUser(githubOptions, handleResponse)
    }
  }

  function getPackageJson(options, cb) {
    options = options || {}
    if (!options.user || !options.repo) {
      // return cb(new Error('Need a username and repo to get package.json'))
      return cb(null, [])
    }
    github.repos.getContent(
      { user: options.user
      , repo: options.repo
      , path: 'package.json'
      }
    , cb
    )
  }

  function getNextPage(options, returnFunction, cb) {
    options.pageNumber += 1
    returnFunction(options, cb)
  }

  function getParts(url) {
    var host = (url.indexOf('bitbucket.org') > -1 ? 'bitbucket.org' : 'github.com')
      , parts = url.split(host)[1].substring(1).split('/');
    parts[1] = parts[1].split('.git')[0];
    return parts;
  }

  function getPackageRepo(packageName, cb) {
    npm.commands.view([ packageName, 'repository.url' ], true, function(err, res) {
      if (!res || Object.keys(res).length === 0) return cb(null, { packageName: packageName, user: '', url: '' })
      var url = res[Object.keys(res)[0]]['repository.url']
        , urlParts = getParts(url)
        , user = urlParts[0]
        , repo = urlParts[1]

      cb(null, { packageName: packageName, user: user, url: url, repo: repo })
    })
  }

  return {
    getOrgMembers: getOrgMembers
  , getRepos: getRepos
  , getPackageJson: getPackageJson
  , getPackageRepo: getPackageRepo
  }

}
