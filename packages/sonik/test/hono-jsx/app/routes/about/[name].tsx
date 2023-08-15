import type { Route } from '../../../../../src'
import Badge from '../../components/Badge'

export default {
  GET: (c, { head }) => {
    const { name } = c.req.param()
    head.set({ title: name })
    return (
      <>
        <p>It's {name}</p>
        <Badge name={name} />
      </>
    )
  },
} satisfies Route
