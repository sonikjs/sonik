import { defineRoute } from 'sonik/misc'

export default defineRoute((app) => {
  app.get('/:name', (c) => {
    const name = c.req.param('name')
    return c.render(<h2>It's {name}!</h2>, {
      title: `About ${name}`,
    })
  })
})
