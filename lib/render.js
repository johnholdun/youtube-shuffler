const render = ({ title, body }) => {
  let documentTitle = 'YouTube Shuffler'
  let masthead = `<p class="masthead"><a href="/">${documentTitle}</a></p>`
  let bodyTitle = `<h1>${title}</h1>`

  if (documentTitle === title) {
    masthead = ''
  } else {
    documentTitle = `${title} – ${documentTitle}`
  }

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${documentTitle}</title>
    <meta name="viewport" content="width=device-width" />
    <style>
      * {
        margin: 0;
        padding: 0;
        font: inherit;
      }
      html {
        font: 18px/1.5 Tahoma, sans-serif;
        color: #003;
        background: #ccc;
        max-width: 30rem;
        padding: 2rem 1rem;
        margin: 0 auto;
      }
      body > * {
        text-indent: -1rem;
        padding-left: 1rem;
      }
      h1 {
        font-weight: bold;
      }
      a {
        color: #00c;
        text-decoration: none;
      }
      .masthead a {
        color: #555;
      }
    </style>
  </head>
  <body>
    ${masthead}
    ${bodyTitle}
    ${body}
  </body>
</html>
`
}

module.exports = render
