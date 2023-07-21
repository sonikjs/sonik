import type { LayoutHandler } from '../../../src'

const handler: LayoutHandler = (children, head) => {
  return (
    <html>
      <head>{head}</head>
      <body>{children}</body>
    </html>
  )
}

export default handler
