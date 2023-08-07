import type { LayoutHandler } from 'sonik'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link href='/static/global.css' rel='stylesheet' />
        {head.createTags()}
      </head>
      <body>
        <div class='wrapper'>
          <header>
            <h1>
              <a href='/'>Top</a>
            </h1>
          </header>
          {children}
          <footer style='margin-top:2rem'>
            <small>© 2023 your name</small>
          </footer>
        </div>
      </body>
    </html>
  )
}

export default handler
