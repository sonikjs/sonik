import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createClient as baseCreateClient } from '../../client/index.js'
import type { ClientOptions } from '../../client/index.js'

export const createClient = (options?: Omit<ClientOptions, 'createElement' | 'hydrate'>) => {
  return baseCreateClient({
    hydrate: (elem, root) => hydrateRoot(root, elem),
    createElement,
    ...options,
  })
}
