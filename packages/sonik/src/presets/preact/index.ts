/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Env } from 'hono'
import { Fragment, createElement, h, options as preactOptions } from 'preact'
import type { VNode } from 'preact'
import { render } from 'preact-render-to-string'
import { DATA_SERIALIZED_PROPS } from '../../constants.js'
import { createApp as baseCreateApp } from '../../server/index.js'
import { serialize } from '../../server/serializer.js'
import type { ServerOptions } from '../../server/server.js'
import type * as types from '../../types.js'

type Node = VNode

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

export type Handler<E extends Env = Env> = types.Handler<E, Node>
export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler = types.LayoutHandler<Node>
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
      const serializedData: Record<string, string> = {}
      serializedData[DATA_SERIALIZED_PROPS] = JSON.stringify(data)
      // @ts-ignore
      return h(originalType, { ...props, ...serializedData })
    }
    // @ts-ignore
    vnode.props['__done'] = true
  }
  // @ts-ignore
  delete vnode.props['__data']
  if (oldHook) oldHook(vnode)
}
