import type { Route, HeadHandler } from '../../../../src'
import Badge from '../../components/Badge'

export const head: HeadHandler = (c) => {
  return {
    title: c.req.param('name'),
  }
}

export default {
  GET: (c) => {
    const { name } = c.req.param()
    return (
      <>
        <p>It's {name}</p>
        <Badge name={name} />
      </>
    )
  },
} satisfies Route
