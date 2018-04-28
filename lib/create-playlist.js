const { google } = require('googleapis')
const YouTube = google.youtube('v3')

const createPlaylist = async ({ oauth, credentials, title, privacyStatus = 'unlisted' }) => {
  oauth.setCredentials(credentials)

  const { data } = await YouTube.playlists.insert({
    part: 'snippet,status',
    resource: {
      snippet: { title },
      status: { privacyStatus }
    }
  })

  return data
}

module.exports = createPlaylist
