import type { LayoutHandler } from 'sonik'

const handler: LayoutHandler = (children) => {
  return (
    <html lang='ja'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
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
            <small>© 2023 yusukebe</small>
          </footer>
        </div>
        <script type='module' src='/static/client.js'></script>
      </body>
    </html>
  )
}

export default handler
