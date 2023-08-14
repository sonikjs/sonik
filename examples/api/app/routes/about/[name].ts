import { Hono } from 'hono'

const app = new Hono()

app.get((c) => {
  const name = c.req.param<'/:name'>('name')
  return c.json({
    'your name is': name,
  })
})

export default app
