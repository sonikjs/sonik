import { Hono } from 'hono/tiny'
import type { Methods, Module } from './types'
import { filePathToPath } from './utils'

const FILES: Record<string, unknown> = import.meta.glob('/src/app/**/[a-zA-Z[]*.tsx', {
  eager: true,
})

type CreateAppOptions = {
  app?: Hono
}

export const createApp = (options?: CreateAppOptions) => {
  const app = options?.app ?? new Hono()
  Object.keys(FILES).map((filePath) => {
    const path = filePathToPath(filePath)
    const module = FILES[filePath] as Module
    Object.keys(module.handler).map((method) => {
      app.on(method, path, (c) => {
        const handler = module.handler[method as Methods]
        if (handler) {
          const res = handler(c)
          if (res instanceof Response) return res
          if (typeof res === 'string' || res['isEscaped']) return c.html(res)
          return c.json(res)
        }
        return c.notFound()
      })
    })
  })
  return app
}
