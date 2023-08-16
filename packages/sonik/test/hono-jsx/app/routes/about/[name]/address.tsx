import type { Route } from '../../../../../../src'

export default {
  GET: (c, { head }) => {
    const { name } = c.req.param()
    head.title = `${name}'s address`
    return <b>{name}'s address</b>
  },
} satisfies Route
