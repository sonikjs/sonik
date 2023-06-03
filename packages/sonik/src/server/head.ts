import type { Node, CreateElement, FragmentType } from '../types.js'

type HeadData = {
  title?: string
  meta?: Record<string, string>[]
  link?: Record<string, string>[]
}

export class Head<N = Node> {
  title?: string
  meta: Record<string, string>[] = []
  link: Record<string, string>[] = []
  #createElement: CreateElement
  #fragment: FragmentType

  constructor({
    createElement,
    fragment,
  }: {
    createElement: CreateElement
    fragment: FragmentType
  }) {
    this.#createElement = createElement
    this.#fragment = fragment
  }

  set(data: HeadData) {
    this.title = data.title
    this.meta = data.meta ?? []
    this.link = data.link ?? []
  }

  createTags(): N {
    return this.#createElement(
      this.#fragment,
      {},
      this.title ? this.#createElement('title', {}, this.title) : null,
      this.meta ? this.meta.map((attr) => this.#createElement('meta', attr)) : null,
      this.link ? this.link.map((attr) => this.#createElement('link', attr)) : null
    )
  }
}
