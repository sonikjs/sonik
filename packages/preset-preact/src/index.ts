export * from './server.js'
export * from 'sonik/misc'

import type { Head } from 'sonik/types'
import type { Node } from './server.js'

declare module 'hono' {
  interface ContextRenderer {
    (content: Node, head?: Partial<Pick<Head, 'title' | 'link' | 'meta'>>):
      | Response
      | Promise<Response>
  }
}
