import { defineRoute } from '../../../src'

export default defineRoute((app) => {
  app.get((c) => {
    return c.render(<h1>Hello</h1>, {
      title: 'This is a title',
      meta: [{ name: 'description', content: 'This is a description' }],
    })
  })
})
