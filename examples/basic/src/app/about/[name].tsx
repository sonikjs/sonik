import type { Route } from '../../../../../src'

export default {
  GET: (c) => {
    const name = c.req.param('name')
    return <h1>It's {name}!</h1>
  },
} satisfies Route
