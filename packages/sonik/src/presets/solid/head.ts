import type { JSX } from 'solid-js'
import { createComponent, ssr } from 'solid-js/web'
import { Head as BaseHead } from '../../server/head'
import { escape, createTagString } from '../../utils/html'

export class Head extends BaseHead {
  constructor() {
    super({
      // createElement and fragment will not be used
      createElement: (type, props) => createComponent(() => type, props),
      fragment: (props: { children: JSX.Element }) => props.children,
    })
  }
  createTags(): JSX.Element {
    let str: string = ''
    if (this.title) str += `<title>${escape(this.title)}</title>`
    if (this.meta.length > 0) str += createTagString('meta', this.meta)
    return createComponent(() => ssr(str), {})
  }
}
