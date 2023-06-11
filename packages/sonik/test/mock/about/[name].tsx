import type { Route } from '../../../src'

export default {
  GET: (c) => {
    return <p>It's {c.req.param('name')}</p>
  },
} satisfies Route
