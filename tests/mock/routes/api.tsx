import { defineRoute } from '../../../src'

export default defineRoute({
  APP: (app) => {
    app.get((c) => {
      c.header('X-Custom', 'Hello')
      return c.json({
        foo: 'bar',
      })
    })
    app.post((c) => {
      return c.json(
        {
          message: 'created',
          ok: true,
        },
        201
      )
    })
  },
})
