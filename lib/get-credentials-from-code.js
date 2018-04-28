const { google } = require('googleapis')
const YouTube = google.youtube('v3')

const getCredentialsFromCode = async ({ oauth, code }) => {
  const { tokens } = await oauth.getToken(code)
  return tokens
}

module.exports = getCredentialsFromCode
