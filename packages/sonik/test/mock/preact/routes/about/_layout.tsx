import type { LayoutHandler } from '../../../../../src/presets/preact'

const handler: LayoutHandler = ({ children }) => {
  return <main>{children}</main>
}

export default handler
