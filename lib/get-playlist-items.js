const { google } = require('googleapis')
const YouTube = google.youtube('v3')

const getPlaylistItems = async ({ oauth, credentials, id, pageToken = null }) => {
  oauth.setCredentials(credentials)

  const LENGTH = 50

  const { data } = await YouTube.playlistItems.list({
    mine: true,
    maxResults: LENGTH,
    part: 'contentDetails',
    playlistId: id,
    pageToken
  })

  let results = [].concat(data.items)

  if (data.nextPageToken) {
    nextResults = await getPlaylistItems({ credentials, id, pageToken: data.nextPageToken })
    results = results.concat(nextResults)
  }

  return results
}

module.exports = getPlaylistItems
