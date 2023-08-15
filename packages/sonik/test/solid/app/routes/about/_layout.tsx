import type { LayoutHandler } from '../../../../../src/presets/solid'

const handler: LayoutHandler = ({ children }) => {
  return <main>{children}</main>
}

export default handler
