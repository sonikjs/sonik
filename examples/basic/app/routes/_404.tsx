import type { NotFoundHandler } from 'sonik'

const handler: NotFoundHandler = () => {
  return <p>Not Found</p>
}

export default handler
