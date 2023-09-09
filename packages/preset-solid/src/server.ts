import type { Env } from 'hono'
import type { JSX } from 'solid-js'
import { createComponent, renderToString } from 'solid-js/web'
import { createApp as baseCreateApp } from 'sonik/server'
import type { ServerOptions } from 'sonik/server'
import type * as types from 'sonik/types'
import { Head } from './head.js'

export type Node = JSX.Element

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

export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler = types.LayoutHandler<Node>
export type FC<Props extends {} = {}> = types.FC<Props, Node>
export type FH<E extends Env = Env> = types.FH<E, Node>
