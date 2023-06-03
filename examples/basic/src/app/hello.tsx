import type { H } from 'nashi'

export const handler: H = {
  GET: (c) => {
    const name = c.req.query('name')
    return <h1>Hello {name}!</h1>
  },
}
