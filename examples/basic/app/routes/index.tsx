import type { Context } from 'sonik'

export default function Index(c: Context) {
  return c.render(
    <div>
      <h2>
        Hello <a href='/about/me'>me</a>!
      </h2>
    </div>,
    {
      title: 'Welcome to Sonik!',
      meta: [{ name: 'description', content: 'This an example for Sonik' }],
    }
  )
}
