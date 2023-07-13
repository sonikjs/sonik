import type { Hono } from '../types'
import type { ServerOptions } from './server'
import { Server } from './server'

type CreateAppOptions = Partial<{
  app: Hono
}> &
  ServerOptions

let server: Server

export function createApp(options?: CreateAppOptions) {
  server = options
    ? new Server({
        ROUTES: options.ROUTES,
        PRESERVED: options.PRESERVED,
        LAYOUTS: options.LAYOUTS,
        root: options.root,
      })
    : new Server()
  return server.createApp({ app: options?.app })
}
