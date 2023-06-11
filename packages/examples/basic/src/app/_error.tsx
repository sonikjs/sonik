import { ErrorHandler } from 'nashi'

const handler: ErrorHandler = (e, c) => {
  return <h1>Error! {e.message}</h1>
}

export default handler
