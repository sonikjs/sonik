import { hydrate, createElement } from 'preact'
import { createClient as baseCreateClient } from '../../client/index.js'
import type { ClientOptions } from '../../client/index.js'

export const createClient = (options?: Omit<ClientOptions, 'createElement' | 'hydrate'>) => {
  return baseCreateClient({
    hydrate,
    createElement,
    ...options,
  })
}
