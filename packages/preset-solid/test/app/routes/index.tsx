import { defineRoute } from '../../../src'

export const route = defineRoute((app) => {
  app.get((c) => {
    return c.render(<h1>Hello</h1>, {
      title: 'This is a title',
      meta: [{ name: 'description', content: 'This is a description' }],
    })
  })
})
