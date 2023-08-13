import { hydrate, createComponent } from 'solid-js/web'
import { createClient as baseCreateClient } from '../../client/index.js'
import type { ClientOptions } from '../../client/index.js'

export const createClient = (options?: Omit<ClientOptions, 'createElement' | 'hydrate'>) => {
  return baseCreateClient({
    hydrate: (fn, node) => {
      if (import.meta.env.DEV) {
        return hydrate(fn(), node)
      }
      return hydrate(fn, node)
    },
    createElement: (type, props) => createComponent(() => type, props),
    ...options,
  })
}
