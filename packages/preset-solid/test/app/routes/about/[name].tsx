import type { Context } from 'sonik'
import Badge from '../../components/Badge'

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
