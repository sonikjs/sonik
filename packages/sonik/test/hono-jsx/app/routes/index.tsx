import type { Route } from '../../../../src'

export default {
  GET: (_, { head }) => {
    head.set({
      title: 'This is a title',
      meta: [{ name: 'description', content: 'This is a description' }],
    })
    return <h1>Hello</h1>
  },
} satisfies Route
