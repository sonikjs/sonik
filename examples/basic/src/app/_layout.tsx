import type { LayoutHandler } from 'nashi'

const handler: LayoutHandler = (children, _c) => {
  return (
    <html>
      <head>
        <title>Nashi.js</title>
      </head>
      <body>{children}</body>
    </html>
  )
}

export default handler
