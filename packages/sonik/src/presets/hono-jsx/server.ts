import type { Env } from 'hono'
import { jsx, Fragment } from 'hono/jsx'
import { createApp as baseCreateApp } from '../../server/index.js'
import type { ServerOptions } from '../../server/server.js'
import type * as types from '../../types.js'

type Node = JSX.Element

export const createApp = <E extends Env = Env>(
  options?: Omit<ServerOptions<E>, 'renderToString' | 'createElement' | 'fragment'>
) => {
  return baseCreateApp<E>({
    renderToString: (node: Node) => node.toString(),
    createElement: jsx,
    fragment: Fragment,
    ...options,
  })
}

export type Handler<E extends Env = Env> = types.Handler<E, Node>
export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler = types.LayoutHandler<Node>
export type FC<E extends Env = Env> = types.FC<E, Node>
export type Route<E extends Env = Env> = types.Route<E, Node>
