import type { LayoutHandler } from '../../../src'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html>
      <head>
        <script type='module' src='./test/app/client.ts'></script>
        {head.createTags()}
      </head>
      <body>{children}</body>
    </html>
  )
}

export default handler
