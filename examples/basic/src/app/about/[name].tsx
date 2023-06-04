import type { H } from '../../../../../src'

export const handler: H = {
  GET: (c) => {
    const name = c.req.param('name')
    return <h1>It's {name}!</h1>
  },
}
