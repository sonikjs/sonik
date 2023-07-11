import type { HeadTag } from 'sonik'
import Counter from '../islands/Counter'

export const headTag: HeadTag = () => {
  return {
    title: 'Welcome to Sonik!',
    meta: [{ name: 'description', content: 'This an example for Sonik' }],
  }
}

export default function Home() {
  return (
    <div>
      <h2>
        Hello <a href='/about/me'>me</a>!
      </h2>
      <Counter />
    </div>
  )
}
