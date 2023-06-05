import type { Context } from 'hono'
import { Hono } from 'hono/tiny'
import type { ErrorHandler, Handler, Route, HandlerResponse, Methods, LayoutHandler } from './types'
import { filePathToPath } from './utils'

const PRESERVED: Record<string, any> = import.meta.glob('/src/app/(_layout|_error|_404).tsx', {
  eager: true,
})

const FILES: Record<string, unknown> = import.meta.glob('/src/app/**/[a-zA-Z[]*.tsx', {
  eager: true,
})

type CreateAppOptions = {
  app?: Hono
}

const getPreserved = () => {
  const preserved = Object.keys(PRESERVED).reduce((preserved, file) => {
    const key = file.replace(/\/src\/app\/|\.tsx$/g, '')
    return { ...preserved, [key]: PRESERVED[file].default }
  }, {}) as Record<string, any>
  return preserved
}

const preserved = getPreserved()

const toResponse = async (c: Context, res: HandlerResponse, status: number = 200) => {
  if (res instanceof Promise) res = await res
  if (res instanceof Response) return res
  if (typeof res === 'string' || res['isEscaped']) {
    const layout = preserved['_layout'] as LayoutHandler
    if (layout) {
      return c.html(await layout(res, c), status)
    }
    return c.html(res, status)
  }
  return c.json(res, status)
}

export const createApp = (options?: CreateAppOptions) => {
  const app = options?.app ?? new Hono()

  Object.keys(FILES).map((filePath) => {
    const path = filePathToPath(filePath)
    const module = FILES[filePath] as { default: Route }
    Object.keys(module.default).map((method) => {
      app.on(method, path, (c) => {
        const handler = module.default[method as Methods]
        if (handler) {
          const res = handler(c)
          return toResponse(c, res)
        }
        return c.notFound()
      })
    })
  })

  const notFound = preserved['_404'] as Handler
  if (notFound) {
    app.notFound((c) => toResponse(c, notFound(c), 404))
  }

  const error = preserved['_error'] as ErrorHandler
  if (error) {
    app.onError((e, c) => toResponse(c, error(e, c), 500))
  }

  return app
}
