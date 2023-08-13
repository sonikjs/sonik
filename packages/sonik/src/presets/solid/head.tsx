import type { JSX } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { Head as BaseHead } from '../../server/head'

export class Head extends BaseHead {
  constructor() {
    super({
      // createElement and fragment will not be used
      createElement: (type, props) => createComponent(() => type, props),
      fragment: <></>,
    })
  }
  createTags(): JSX.Element {
    return (
      <>
        {this.title ? <title>{this.title}</title> : <></>}
        {this.meta ? this.meta.map((record) => <meta {...record} />) : <></>}
        {this.link ? this.link.map((record) => <meta {...record} />) : <></>}
      </>
    )
  }
}
