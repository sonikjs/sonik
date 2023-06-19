import { defineRoute } from 'sonik'

export default defineRoute({
  GET: (c) => {
    const name = c.req.param('name')
    return <h2>It's {name}!</h2>
  },
})
