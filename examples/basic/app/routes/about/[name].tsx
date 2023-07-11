import type { Route, HeadTag } from 'sonik'

export const headTag: HeadTag = (c) => {
  return {
    title: `It's ${c.req.param('name')}`,
  }
}

export default {
  GET: (c) => {
    const name = c.req.param('name')
    return <h2>It's {name}!</h2>
  },
} satisfies Route
