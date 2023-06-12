import { ErrorHandler } from 'sonik'

const handler: ErrorHandler = (e, _c) => {
  return <h1>Error! {e.message}</h1>
}

export default handler
