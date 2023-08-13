import type { Route } from 'sonik/react'

export default {
  GET: (c, { head }) => {
    const name = c.req.param('name')
    head.title = `About ${name}`
    return <h2>It's {name}!</h2>
  },
} satisfies Route
