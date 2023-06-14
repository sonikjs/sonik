import { defineRoute } from 'sonik'

export default defineRoute({
  GET: (c) => {
    const name = c.req.param('name')
    return <h1>It's {name}!</h1>
  },
})
