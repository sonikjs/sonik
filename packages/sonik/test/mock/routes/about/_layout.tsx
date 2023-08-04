import type { LayoutHandler } from '../../../../src'

const handler: LayoutHandler = (_, { children }) => {
  return <main>{children}</main>
}

export default handler
