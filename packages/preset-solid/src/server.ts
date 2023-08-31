import type { Env } from 'hono'
import type { JSX } from 'solid-js'
import { createComponent, renderToString } from 'solid-js/web'
import { createApp as baseCreateApp } from 'sonik/server'
import type { ServerOptions } from 'sonik/server'
import type * as types from 'sonik/types'
import { Head } from './head.js'

type Node = JSX.Element

function fragment(props: { children: JSX.Element }) {
  return props.children
}

export const createApp = <E extends Env = Env>(
  options?: Omit<ServerOptions<E>, 'renderToString' | 'createElement' | 'fragment'>
) => {
  return baseCreateApp<E>({
    renderToString: (Comp) => renderToString(() => Comp),
    createElement: (type, props) => createComponent(() => type, props),
    createHead: () => new Head(),
    fragment: () => fragment,
    ...options,
  })
}

export type Handler<E extends Env = Env> = types.Handler<E, Node>
export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler = types.LayoutHandler<Node>
export type FC<E extends Env = Env> = types.FC<E, Node>
export type Route<E extends Env = Env> = types.Route<E, Node>
