require('dotenv').config()

const { google } = require('googleapis')
const { knuthShuffle } = require('knuth-shuffle')
const getCredentialsFromCode = require('./lib/get-credentials-from-code')
const getPlaylists = require('./lib/get-playlists')
const createPlaylist = require('./lib/create-playlist')
const getPlaylistItems = require('./lib/get-playlist-items')
const insertPlaylistItem = require('./lib/insert-playlist-item')
const render = require('./lib/render')

let oauth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

google.options({ auth: oauth })

const express = require('express')
const app = express()

app.get('/', async (req, res) => {
  res.send(render({ title: 'YouTube Shuffler', body: `
    <p>
      Create a new, unlisted playlist on your account that includes every
      video from a playlist you’ve already created, but in a random order.
    </p>
    <p>
      Ready?
      <a href="/authorize">Log in with YouTube</a>
    </p>
    <p>
      This was created by
      <a href="https://johnholdun.com">John</a>
      literally because of
      <a href="http://motd.co/2018/04/how-to-shuffle-a-playlist-on-youtube/">Casey</a>.
    </p>
  `}))
})

app.get('/playlists', async (req, res) => {
  let { credentials } = req.query

  if (credentials) {
    try {
      credentials = JSON.parse(credentials)
    } catch (e) {
      credentials = null
    }
  }

  if (!credentials) {
    return res.status(400).send(render({ title: 'No', body: `
      <p>
        Your credentials are…wrong.
      </p>
      <p>
        Care to try again?
        <a href="/authorize">Log in with YouTube</a>
      </p>
    `}))
  }

  let playlists

  try {
    playlists = await getPlaylists({ oauth, credentials })
  } catch (e) {
    return res.status(500).send(render({ title: 'No',
      body: `
      <p>
        I tried to fetch your playlists but I couldn’t. Does this make sense to
        you?
        <strong>
          ${e}
        </strong>
      </p>
      <p>
        Care to try again?
        <a href="/authorize">Log in with YouTube</a>
      </p>
    `}))
  }

  if (!playlists.length) {
    return res.status(400).send(render({ title: 'Hmmm', body: `
      <p>
        You don’t have any playlists. Not on this YouTube account, at least.
      </p>
      <p>
        Care to try again?
        <a href="/authorize">Log in with YouTube</a>
      </p>
    `}))
  }

  res.send(render({ title: 'Great',
    body: `
    <p>
      Choose a playlist. I’ll create a new, unlisted playlist on your account
      that includes every video from the playlist you’ve chosen, but in a
      random order.
    </p>
    ${playlists.map((playlist) => (`
      <p>
        <a
          href="/playlists/${playlist.id}/shuffle?credentials=${encodeURIComponent(JSON.stringify(credentials))}&title=${encodeURIComponent(playlist.snippet.title)}"
        >
          ${playlist.snippet.title}
        </a>
      </p>
    `)).join('\n')}
  `}))
})

app.get('/playlists/:playlistId/shuffle', async (req, res) => {
  const { playlistId } = req.params
  let { credentials, title } = req.query

  if (credentials) {
    try {
      credentials = JSON.parse(credentials)
    } catch (e) {
      credentials = null
    }
  }

  if (!credentials) {
    return res.status(400).send(render({ title: 'No', body: `
      <p>
        Your credentials are…wrong.
      </p>
      <p>
        Care to try again?
        <a href="/authorize">Log in with YouTube</a>
      </p>
    `}))
  }

  const newTitle = `${title} (Shuffled)`
  let playlistItems
  let newPlaylist

  try {
    playlistItems = await getPlaylistItems({ oauth, credentials, id: playlistId })
    if (!playlistItems.length) {
      throw new Error('Your playlist is empty')
    }
    newPlaylist = await createPlaylist({ oauth, credentials, title: newTitle })
    const videoIds = playlistItems.map(i => i.contentDetails.videoId)
    for (let index in knuthShuffle(videoIds)) {
      const videoId = videoIds[index]
      await insertPlaylistItem({ oauth, credentials, playlistId: newPlaylist.id, videoId })
    }
  } catch (e) {
    return res.status(400).send(render({ title: 'No',
      body: `
      <p>
        I tried creating a new shuffled playlist but I got an error:
        <strong>${error}</strong>
      </p>
      <p>
        Care to try again?
        <a href="/playlists?credentials=${encodeURIComponent(JSON.stringify(credentials))}">
          Choose a playlist
        </a>
      </p>
    `}))
  }

  res.send(render({ title: 'Wow!',
    body: `
    <p>
      It’s all done. Your new playlist, <i>${newTitle}</i>, now contains
      ${playlistItems.length} video${playlistItems.length === 1 ? '' : 's'} and
      is ready to enjoy.
    </p>
    <p>
      <a href="https://www.youtube.com/playlist?list=${newPlaylist.id}">
        Enjoy it now
      </a>
    </p>
  `}))
})

app.get('/authorize', (req, res) => {
  res.redirect(oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube']
  }))
})

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query

  try {
    credentials = await getCredentialsFromCode({ oauth, code })
  } catch (e) {
    return res.status(500).send(render({ title: 'Sorry',
      body: `
      <p>Couldn’t get credentials from code: ${e.message}</p>
      <p>
        Care to try again?
        <a href="/authorize">Log in with YouTube</a>
      </p>
    `}))
  }

  res.redirect(`/playlists?credentials=${encodeURIComponent(JSON.stringify(credentials))}`)
})

app.listen(8080, () => console.log('Example app listening on port 8080!'))
