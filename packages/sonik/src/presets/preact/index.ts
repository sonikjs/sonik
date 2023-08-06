/* eslint-disable @typescript-eslint/ban-ts-comment */
export type { Env, Context }
import type { Env, Context } from 'hono'
import { h, options as preactOptions } from 'preact'
import type { VNode } from 'preact'
import { render } from 'preact-render-to-string'
import { createApp as baseCreateApp } from '../../server/index.js'
import { serialize } from '../../server/serializer.js'
import type { ServerOptions } from '../../server/server.js'
import type * as types from '../../types.js'

type Node = VNode

export const createApp = <E extends Env = Env>(options?: Omit<ServerOptions, 'renderToString'>) => {
  return baseCreateApp<E>({
    renderToString: render,
    ...options
  })
}

export type Handler<E extends Env = Env> = types.Handler<E, Node>
export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler<E extends Env = Env> = types.LayoutHandler<E, Node>
export type FC<E extends Env = Env> = types.FC<E, Node>
export type Route<E extends Env = Env> = types.Route<E, Node>

/** Serialize server values into nodes */
const oldHook = preactOptions.vnode
let data = {}
preactOptions.vnode = (vnode) => {
  // @ts-ignore
  if (typeof vnode.type === 'function' && !vnode.props['__done']) {
    const originalType = vnode.type
    vnode.type = (props) => {
      data = serialize(props)
      return h(originalType, props)
    }
    // @ts-ignore
    vnode.props['__done'] = true
  }

  // @ts-ignore
  if (vnode.props['component-name'] && !vnode.props['__done']) {
    const originalType = vnode.type
    vnode.type = (props) => {
      // @ts-ignore
      return h(originalType, { ...props, 'data-serialized-props': JSON.stringify(data) })
    }
    // @ts-ignore
    vnode.props['__done'] = true
  }
  // @ts-ignore
  delete vnode.props['__data']
  if (oldHook) oldHook(vnode)
}
