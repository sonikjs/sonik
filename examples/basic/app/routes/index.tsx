import type { Route } from 'sonik'

export default {
  GET: (c, head) => {
    head.set({
      title: 'Welcome to Sonik!',
      meta: [{ name: 'description', content: 'This an example for Sonik' }],
    })
    return (
      <div>
        <h2>
          Hello <a href='/about/me'>me</a>!
        </h2>
      </div>
    )
  },
} satisfies Route
