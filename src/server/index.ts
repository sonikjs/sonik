import type { Hono, AppHandler, ReservedHandler, FC } from '../types'
import { Server } from './server'

type CreateAppOptions = Partial<{
  app: Hono
  PRESERVED: Record<string, unknown>
  FILES: Record<string, unknown>
  root: string
}>

export function createApp(options?: CreateAppOptions) {
  const server = options
    ? new Server({
        FILES: options.FILES as Record<string, { default: FC; app?: AppHandler }>,
        PRESERVED: options.PRESERVED as Record<string, { default: ReservedHandler }>,
        root: options.root,
      })
    : new Server()
  return server.createApp({ app: options?.app })
}
