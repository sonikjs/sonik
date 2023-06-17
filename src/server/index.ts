/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Env } from 'hono'
import { h, options as preactOptions } from 'preact'
import { DEFAULT_PROPS, SERIALIZE_KEY } from '../constants'
import type { Hono, Route, AppHandler, ReservedHandler, FC } from '../types'
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
interface Signal {
  peek(): unknown
  value: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSignal = (x: any): x is Signal => {
  return x !== null && typeof x === 'object' && typeof x.peek === 'function' && 'value' in x
}

let signalIdCounter = 0
const signalMap = new Map()

export const serialize = (props: Record<string, unknown>) => {
  const data: Record<string, unknown> = {}
  Object.keys(props).map((key) => {
    if (!DEFAULT_PROPS.includes(key)) {
      const value = props[key]
      if (isSignal(value)) {
        let signalId
        if (signalMap.has(value)) {
          signalId = signalMap.get(value)
        } else {
          signalId = signalIdCounter++
          signalMap.set(value, signalId)
        }
        data[key] = { [SERIALIZE_KEY]: 's', v: value.peek(), id: signalId }
      } else {
        data[key] = { [SERIALIZE_KEY]: 'l', v: value }
      }
    }
  })
  return data
}

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
