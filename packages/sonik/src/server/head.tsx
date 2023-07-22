export class Head {
  title?: string
  meta?: Record<string, string>[]
  link?: Record<string, string>[]
  script?: Record<string, string>[]

  set(data: Omit<typeof this, 'set'>) {
    this.title = data.title
    this.meta = data.meta
    this.link = data.link
    this.script = data.script
  }
}

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
