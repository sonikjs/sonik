import type { ErrorHandler } from '../../src'

const handler: ErrorHandler = (e) => {
  return <h1>Custom Error Message: {e.message}</h1>
}

export default handler
