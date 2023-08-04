type HeadData = {
  title?: string
  meta?: Record<string, string>[]
  link?: Record<string, string>[]
  script?: Record<string, string>[]
}

export class Head {
  private title?: string
  private meta?: Record<string, string>[]
  private link?: Record<string, string>[]

  set(data: HeadData) {
    this.title = data.title
    this.meta = data.meta
    this.link = data.link
  }

  createHeadTag() {
    return (
      <>
        {this.title ? <title>{this.title}</title> : <></>}
        {this.meta ? (
          this.meta.map((attr) => {
            return <meta {...attr} />
          })
        ) : (
          <></>
        )}
        {this.link ? (
          this.link.map((attr) => {
            return <link {...attr} />
          })
        ) : (
          <></>
        )}
      </>
    )
  }
}
