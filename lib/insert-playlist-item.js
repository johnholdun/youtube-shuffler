const { google } = require('googleapis')
const YouTube = google.youtube('v3')

const insertPlaylistItem = async ({ oauth, credentials, playlistId, videoId }) => {
  oauth.setCredentials(credentials)

  const { data } = await YouTube.playlistItems.insert({
    part: 'snippet',
    resource: {
      snippet: {
        playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId
        }
      }
    }
  })

  return data
}

module.exports = insertPlaylistItem
