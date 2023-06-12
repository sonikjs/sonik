import type { Route } from '../../src'

export default {
  GET: () => {
    throw new Error('Foo')
  },
} satisfies Route
