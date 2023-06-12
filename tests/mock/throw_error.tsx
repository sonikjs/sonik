import { defineRoute } from '../../src'

export default defineRoute({
  GET: () => {
    throw new Error('Foo')
  },
})
