import { defineRoute } from '../../../src'

export const route = defineRoute((app) => {
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
})
