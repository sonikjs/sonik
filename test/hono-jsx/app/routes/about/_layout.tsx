import type { LayoutHandler } from '../../../../../src'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html>
      <head>
        <head>{head.createTags()}</head>
      </head>
      <body>
        <h1>About</h1>
        {children}
      </body>
    </html>
  )
}

export default handler
