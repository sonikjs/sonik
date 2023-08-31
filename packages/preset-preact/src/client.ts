import { hydrate, createElement } from 'preact'
import { createClient as baseCreateClient } from 'sonik/client'
import type { ClientOptions } from 'sonik/client'

export const createClient = (options?: Omit<ClientOptions, 'createElement' | 'hydrate'>) => {
  return baseCreateClient({
    hydrate,
    createElement,
    ...options,
  })
}
