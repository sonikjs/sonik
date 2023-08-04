import type { ErrorHandler } from '../../../src'

const handler: ErrorHandler = (_, { error }) => {
  return <h1>Custom Error Message: {error.message}</h1>
}

export default handler
