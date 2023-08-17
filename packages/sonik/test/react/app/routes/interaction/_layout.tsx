/** @jsxImportSource react */
import type { LayoutHandler } from '../../../../../src/presets/react'

const handler: LayoutHandler = ({ children }) => {
  return (
    <html>
      <head>
        <script>var global = window</script>
        <script type='module' src='/app/client.ts'></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

export default handler
