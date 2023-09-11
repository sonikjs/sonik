import { defineRoute } from '../../../../src'

export const route = defineRoute((app) => {
  app.get(() => {
    throw new Error('Foo')
  })
})
