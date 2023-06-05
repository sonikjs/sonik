import type { Route } from '../../src'

export default {
  GET: (c) =>
    c.json({ foo: 'bar' }, 200, {
      'X-Custom': 'Hello',
    }),
  POST: (c) =>
    c.json(
      {
        ok: true,
        message: 'created',
      },
      201
    ),
} satisfies Route
