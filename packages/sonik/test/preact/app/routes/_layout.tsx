import type { LayoutHandler } from '../../../../src/presets/preact'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html>
      <head>
        <script type='module' src='/app/client.ts'></script>
        {head.createTags()}
      </head>
      <body>{children}</body>
    </html>
  )
}

export default handler
