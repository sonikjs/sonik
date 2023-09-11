import type { Context } from '../../../../../../src'

export default function Address(c: Context) {
  const { name } = c.req.param()
  return c.render(<b>{name}'s address</b>, {
    title: `${name}'s address`,
  })
}
