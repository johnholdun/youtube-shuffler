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
    <link href="https://fonts.googleapis.com/css?family=Gothic+A1:400,700" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        font: inherit;
        box-sizing: border-box;
      }
      html {
        font: 24px/1.8 'Gothic A1', sans-serif;
        font-weight: 400;
        color: #262669;
        background: #d0d3ea;
        max-width: 30rem;
        padding: 2rem 1rem;
        margin: 0 auto;
      }
      body > * {
        text-indent: -1rem;
        padding-left: 1rem;
      }
      h1, b, strong {
        font-weight: 700;
      }
      i, em {
        font-style: italic;
      }
      a {
        color: #3e3ef3;
        text-decoration: none;
      }
      a.btn {
        display: block;
        padding: .45rem .9rem;
        margin: .45rem 0 .45rem -1rem;
        text-indent: 0;
        text-align: center;
        border: 2px solid currentColor;
      }
      .masthead a {
        color: #616174;
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
