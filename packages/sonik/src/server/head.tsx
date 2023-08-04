type HeadData = {
  title?: string
  meta?: Record<string, string>[]
  link?: Record<string, string>[]
}

export class Head {
  #title?: string
  #meta?: Record<string, string>[]
  #link?: Record<string, string>[]

  set(data: HeadData) {
    this.#title = data.title
    this.#meta = data.meta
    this.#link = data.link
  }

  set title(value: string) {
    this.#title = value
  }

  set meta(records: Record<string, string>[]) {
    this.#meta = records
  }

  set link(records: Record<string, string>[]) {
    this.#link = records
  }

  createTags() {
    return (
      <>
        {this.#title ? <title>{this.#title}</title> : <></>}
        {this.#meta ? (
          this.#meta.map((attr) => {
            return <meta {...attr} />
          })
        ) : (
          <></>
        )}
        {this.#link ? (
          this.#link.map((attr) => {
            return <link {...attr} />
          })
        ) : (
          <></>
        )}
      </>
    )
  }
}
