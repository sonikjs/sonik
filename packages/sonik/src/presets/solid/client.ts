import { children } from 'solid-js'
import { hydrate, createComponent } from 'solid-js/web'
import { createClient as baseCreateClient } from '../../client/index.js'
import type { ClientOptions } from '../../client/index.js'

export const createClient = (options?: Omit<ClientOptions, 'createElement' | 'hydrate'>) => {
  return baseCreateClient({
    hydrate: (fn, node) => {
      return hydrate(
        children(() => fn),
        node
      )
    },
    createElement: (Comp, props) => createComponent(Comp, props),
    ...options,
  })
}
