import { defineRoute } from '../../../../src'

export default defineRoute((app) => {
  app.get(() => {
    throw new Error('Foo')
  })
})
