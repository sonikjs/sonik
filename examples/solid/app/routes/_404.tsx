import type { NotFoundHandler } from '@sonikjs/solid'

const handler: NotFoundHandler = () => {
  return <p>Not Found</p>
}

export default handler
