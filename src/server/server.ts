import type { Context, Env } from 'hono'
import { Hono } from 'hono/quick'
import type { VNode } from 'preact'
import { h } from 'preact'
import { render } from 'preact-render-to-string'
import type { Route, ErrorHandler, Handler, ReservedHandler, FC, LayoutHandler } from '../types'
import { filePathToPath, sortObject } from '../utils'

type ServerOptions = Partial<{
  PRESERVED: Record<string, { default: ReservedHandler }>
  FILES: Record<string, { default: FC & Route }>
  root: string
}>

export class Server {
  readonly PRESERVED: Record<string, { default: ReservedHandler }>
  readonly FILES: Record<string, { default: FC & Route }>
  readonly preservedHandlers: Record<string, ReservedHandler>
  readonly root: string

  count: number = 0

  constructor(options?: ServerOptions) {
    // `import.meta.glob` can only use literals
    this.PRESERVED =
      options?.PRESERVED ??
      import.meta.glob('/app/routes/(_layout|_error|_404).(tsx|ts)', {
        eager: true,
      })

    // Check all routes are exporting `default`
    // Currently, this part only check files under `/app/routes/**`
    import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(tsx|ts)', {
      eager: true,
      import: 'default',
    })

    const FILES =
      options?.FILES ??
      import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(tsx|ts)', {
        eager: true,
      })

    this.FILES = sortObject(FILES)

    this.root = options?.root ?? '/app/routes'

    // Init preservedHandlers
    this.preservedHandlers = Object.keys(this.PRESERVED).reduce((preserved, file) => {
      const root = this.root
      const key = file.replace(`${root}/`, '').replace(/\.tsx$/g, '')
      return { ...preserved, [key]: this.PRESERVED[file].default }
    }, {}) as Record<string, ReservedHandler>
  }

  private toWebResponse = async (
    c: Context,
    res: VNode | Promise<VNode> | Response | Promise<Response>,
    status: number = 200
  ) => {
    if (res instanceof Promise) res = await res
    if (res instanceof Response) return res
    const layout = this.preservedHandlers['_layout'] as LayoutHandler

    const addDocType = (html: string) => {
      return `<!doctype html>${html}`
    }

    if (layout) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return c.html(addDocType(render(layout(res, c))), status)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return c.html(render(res), status)
  }

  createApp = <E extends Env>(options?: { app?: Hono }): Hono<E> => {
    const app = options?.app ?? new Hono()

    Object.keys(this.FILES).map((filePath) => {
      const path = filePathToPath(filePath, this.root)
      const fileDefault = this.FILES[filePath].default

      if (typeof fileDefault === 'function') {
        app.get(path, (c) => {
          const res = h(() => fileDefault(c), {})
          return this.toWebResponse(c, res)
        })
      }

      Object.keys(fileDefault).map((method) => {
        if (method === 'APP') {
          const appHandler = fileDefault['APP']
          if (appHandler) {
            appHandler(app.use(path))
          }
        } else {
          const handler = fileDefault[method as keyof Route] as Handler
          if (handler) {
            app.on(method, path, (c) => {
              return this.toWebResponse(c, handler(c))
            })
          }
        }
      })
    })

    const notFound = this.preservedHandlers['_404'] as Handler
    if (notFound) {
      app.notFound((c) => this.toWebResponse(c, notFound(c), 404))
    }

    const error = this.preservedHandlers['_error'] as ErrorHandler
    if (error) {
      app.onError((e, c) => this.toWebResponse(c, error(e, c), 500))
    }

    return app as unknown as Hono<E>
  }
}
