import Counter from '../island/Counter'
import Foo from '../island/Foo'
import type { Context } from 'nashi'

export default function Home(c: Context) {
  return (
    <div>
      <h2>Hello {c.req.query('name')}!</h2>
      <Counter />
      <Counter />
      <Counter />
    </div>
  )
}
