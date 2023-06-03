import type { NotFoundHandler } from '@sonikjs/preact'

const handler: NotFoundHandler = () => {
  return <p>Not Found</p>
}

export default handler
