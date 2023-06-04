import type { Route } from 'nashi'

export default {
  GET: (c) => {
    const name = c.req.param('name')
    return <h1>It's {name}!</h1>
  },
} satisfies Route
