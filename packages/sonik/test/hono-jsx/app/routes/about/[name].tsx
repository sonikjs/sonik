import type { Context } from '../../../../../src'
import { defineRoute } from '../../../../../src'
import Badge from '../../components/Badge'

export const route = defineRoute((app) => {
  app.post((c) => {
    return c.text('Created!', 201)
  })
})

export default function Books(c: Context) {
  return c.render(
    <form method='POST'>
      <input type='text' name='title' />
      <input type='submit' />
    </form>
  )
}
