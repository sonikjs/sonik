/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Env } from 'hono'
import { h, options as preactOptions } from 'preact'
import type { Hono, Route, AppHandler, ReservedHandler, FC } from '../types'
import { Serializer } from './serializer'
import { Server } from './server'

type CreateAppOptions = Partial<{
  app: Hono
  PRESERVED: Record<string, unknown>
  FILES: Record<string, unknown>
  root: string
}>

export function createApp<E extends Env>(options?: CreateAppOptions) {
  const server = options
    ? new Server({
        FILES: options.FILES as Record<string, { default: FC; app?: AppHandler }>,
        PRESERVED: options.PRESERVED as Record<string, { default: ReservedHandler }>,
        root: options.root,
      })
    : new Server()
  return server.createApp<E>({ app: options?.app })
}

export function defineRoute(route: Route) {
  return route
}

const serializer = new Serializer()

const oldHook = preactOptions.vnode
let data = {}
preactOptions.vnode = (vnode) => {
  // @ts-ignore
  if (typeof vnode.type === 'function' && !vnode.props['__done']) {
    const originalType = vnode.type
    vnode.type = (props) => {
      data = serializer.serialize(props)
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
