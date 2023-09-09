import type { Env } from 'hono'
import { Fragment, createElement } from 'preact'
import type { VNode } from 'preact'
import { render } from 'preact-render-to-string'
import { createApp as baseCreateApp } from 'sonik/server'
import type { ServerOptions } from 'sonik/server'
import type * as types from 'sonik/types'

export type Node = VNode

export const createApp = <E extends Env = Env>(
  options?: Omit<ServerOptions<E>, 'renderToString' | 'createElement' | 'fragment'>
) => {
  return baseCreateApp<E>({
    renderToString: render,
    createElement: createElement,
    fragment: Fragment,
    ...options,
  })
}

export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler = types.LayoutHandler<Node>
export type FC<Props extends {} = {}> = types.FC<Props, Node>
export type FH<E extends Env = Env> = types.FH<E, Node>
