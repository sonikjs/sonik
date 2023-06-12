import { defineRoute } from '../../../src'

export default defineRoute({
  GET: (c) => {
    return <p>It's {c.req.param('name')}</p>
  },
})
