import { defineRoute } from '../../../../../../src'

export default defineRoute((app) => {
  app.get((c) => {
    const { name } = c.req.param<'/:name/address'>()
    return c.render(<b>{name}'s address</b>, {
      title: `${name}'s address`,
    })
  })
})
