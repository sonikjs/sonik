import type { LayoutHandler } from '../../../../../../src'

const handler: LayoutHandler = ({ children }) => {
  return <address>{children}</address>
}

export default handler
