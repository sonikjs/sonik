import type { LayoutHandler } from '../../../../../src'

const handler: LayoutHandler = ({ children }) => {
  return <main>{children}</main>
}

export default handler
