export * from './server.js'
import type { Head } from '../types.js'
import type { Node } from './server.js'

declare module 'hono' {
  interface ContextRenderer {
    (content: Node, head?: Partial<Pick<Head, 'title' | 'link' | 'meta'>>):
      | Response
      | Promise<Response>
  }
}
