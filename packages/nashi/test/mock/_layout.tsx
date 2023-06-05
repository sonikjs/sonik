import type { LayoutHandler } from '../../src'

const handler: LayoutHandler = (children, c) => {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

export default handler
