import { h, options as preactOptions } from 'preact'
import { Serializer } from './server/serializer'
export { createApp } from './server'
export type * from './types'

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
