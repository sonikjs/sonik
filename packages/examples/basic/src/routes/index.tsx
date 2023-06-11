import Counter from '../island/Counter'
import type { Context } from 'sonik'

export default function Home(c: Context) {
  return (
    <div>
      <h2>Hello {c.req.query('name')}!</h2>
      <Counter />
    </div>
  )
}
