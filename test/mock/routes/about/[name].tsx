import { defineRoute } from '../../../../src'
import Badge from '../../components/Badge'

export default defineRoute({
  GET: (c) => {
    const { name } = c.req.param()
    return (
      <>
        <p>It's {name}</p>
        <Badge name={name} />
      </>
    )
  },
})
