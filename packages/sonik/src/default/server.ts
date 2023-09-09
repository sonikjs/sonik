import type { Env } from 'hono'
import { jsx, Fragment } from 'hono/jsx'
import { createApp as baseCreateApp } from '../server/server.js'
import type { ServerOptions } from '../server/server.js'
import type * as types from '../types.js'

export type Node = JSX.Element

export const createApp = <E extends Env = Env>(
  options?: Omit<
    ServerOptions<E>,
    'renderToString' | 'renderToReadableStream' | 'createElement' | 'fragment'
  >
) => {
  return baseCreateApp<E>({
    renderToString: (node: Node) => node.toString(),
    createElement: jsx,
    fragment: Fragment,
    ...options,
  })
}

export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler = types.LayoutHandler<Node>
export type FC<Props extends {} = {}> = types.FC<Props, Node>
export type FH<E extends Env = Env> = types.FH<E, Node>
