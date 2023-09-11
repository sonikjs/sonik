import { defineRoute } from '../../../../src'
import Badge from '../../components/Badge'

export const route = defineRoute((app) => {
  app.get((c) => {
    const { name } = c.req.param<'/about/:name'>()
    return c.render(
      <>
        <p>It's {name}</p>
        <Badge name={name} />
      </>,
      {
        title: name,
      }
    )
  })
})
