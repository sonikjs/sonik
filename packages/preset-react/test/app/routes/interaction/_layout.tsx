import type { LayoutHandler } from '../../../../src'

const handler: LayoutHandler = ({ children }) => {
  return (
    <html>
      <head>
        <script>var global = window</script>
        <script type='module' src='/test/app/client.ts'></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

export default handler
