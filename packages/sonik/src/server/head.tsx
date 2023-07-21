import type { Head } from '../types'

export const createHeadTag = (head?: Head) => {
  return (
    <>
      {head && head.title ? <title>{head.title}</title> : <></>}
      {head && head.meta ? (
        head.meta.map((attr) => {
          return <meta {...attr} />
        })
      ) : (
        <></>
      )}
      {head && head.link ? (
        head.link.map((attr) => {
          return <link {...attr} />
        })
      ) : (
        <></>
      )}
    </>
  )
}
