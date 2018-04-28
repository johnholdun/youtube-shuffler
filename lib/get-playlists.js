const { google } = require('googleapis')
const YouTube = google.youtube('v3')

const getPlaylists = async ({ oauth, credentials, pageToken = null }) => {
  oauth.setCredentials(credentials)

  const { data } = await YouTube.playlists.list({
    mine: true,
    maxResults: 50,
    part: 'snippet,contentDetails',
    pageToken
  })

  let results = [].concat(data.items)

  if (data.nextPageToken) {
    nextResults = await getPlaylists({ credentials, pageToken: data.nextPageToken })
    results = results.concat(nextResults)
  }

  return results
}

module.exports = getPlaylists
