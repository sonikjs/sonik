import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createClient as baseCreateClient } from 'sonik/client'
import type { ClientOptions } from 'sonik/client'

export const createClient = (options?: Omit<ClientOptions, 'createElement' | 'hydrate'>) => {
  return baseCreateClient({
    hydrate: (elem, root) => hydrateRoot(root, elem),
    createElement,
    ...options,
  })
}
