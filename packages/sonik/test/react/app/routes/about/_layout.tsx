import type { LayoutHandler } from '../../../../../src/presets/react'

const handler: LayoutHandler = ({ children }) => {
  return <main>{children}</main>
}

export default handler
