import { HydrationScript } from 'solid-js/web'
import type { LayoutHandler } from '../../../../../src/presets/solid'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html>
      <head>
        <script type='module' src='/app/client.ts'></script>
        {head.createTags()}
        <HydrationScript />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default handler
