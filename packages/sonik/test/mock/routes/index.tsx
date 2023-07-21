import type { Route, Head } from '../../../src'

export const head: Head = {
  title: 'This is a title',
  meta: [{ name: 'description', content: 'This is a description' }],
}

export default {
  GET: () => <h1>Hello</h1>,
} satisfies Route
