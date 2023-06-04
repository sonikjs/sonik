import type { Route } from '../../../../src'

export default {
  GET: (c) => {
    const name = c.req.query('name')
    return <h1>Hello {name}!</h1>
  },
} satisfies Route
