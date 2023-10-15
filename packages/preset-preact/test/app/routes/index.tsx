import { defineRoute } from 'sonik'

export const route = defineRoute((app) => {
  app.get((c) => {
    const res = c.render(<h1>Hello</h1>, {
      title: 'This is a title',
      meta: [{ name: 'description', content: 'This is a description' }],
    })
    return res
  })
})
