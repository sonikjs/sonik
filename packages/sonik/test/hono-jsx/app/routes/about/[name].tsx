import type { Context } from '../../../../../src'
import { defineRoute } from '../../../../../src'
import Badge from '../../components/Badge'

export const route = defineRoute((app) => {
  app.post((c) => {
    return c.text('Created!', 201)
  })
})

export default function AboutName(c: Context) {
  const { name } = c.req.param()
  return c.render(
    <>
      <p>It's {name}</p>
      <Badge name={name} />
    </>,
    {
      title: name,
    }
  )
}
