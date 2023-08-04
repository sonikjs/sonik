import type { Context, Env } from 'hono'
import { Hono } from 'hono'
import type { Route, ErrorHandler, Handler, FC, LayoutHandler, NotFoundHandler } from '../types'
import { Head } from './head'
import { filePathToPath, groupByDirectory, listByDirectory } from '../utils'

const NOTFOUND_FILENAME = '_404.tsx'
const ERROR_FILENAME = '_error.tsx'

export type ServerOptions = Partial<{
  PRESERVED: Record<string, PreservedFile>
  LAYOUTS: Record<string, LayoutFile>
  ROUTES: Record<string, RouteFile>
  root: string
}>

type Dir = string
type FileName = string

export type RouteFile = { default: FC & Route }
type RouteMap = Record<Dir, Record<FileName, RouteFile>>

export type LayoutFile = { default: LayoutHandler }
type LayoutList = Record<Dir, FileName[]>

export type PreservedFile = { default: ErrorHandler | Handler }
type PreservedMap = Record<Dir, Record<FileName, PreservedFile>>

const addDocType = (html: string) => {
  return `<!doctype html>${html}`
}

export class Server {
  private PRESERVED: Record<string, PreservedFile>
  private LAYOUTS: Record<string, LayoutFile>
  private preservedMap: PreservedMap
  private layoutList: LayoutList
  private routesMap: RouteMap
  private root: string

  constructor(options?: ServerOptions) {
    // `import.meta.glob` can only use literals
    this.PRESERVED =
      options?.PRESERVED ??
      import.meta.glob('/app/routes/**/(_error|_404).(tsx)', {
        eager: true,
      })

    this.preservedMap = groupByDirectory(this.PRESERVED)

    this.LAYOUTS =
      options?.LAYOUTS ??
      import.meta.glob('/app/routes/**/_layout.tsx', {
        eager: true,
      })

    this.layoutList = listByDirectory(this.LAYOUTS)

    const ROUTES =
      options?.ROUTES ??
      import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(tsx|mdx)', {
        eager: true,
      })

    this.routesMap = groupByDirectory(ROUTES)

    this.root = options?.root ?? '/app/routes'
  }

  private toWebResponse = async (
    c: Context,
    res: string | Promise<string> | Response | Promise<Response>,
    status: number = 200,
    {
      layouts,
      head,
      filename,
    }: {
      head: Head
      layouts?: string[]
      filename: string
    }
  ) => {
    if (res instanceof Promise) res = await res
    if (res instanceof Response) return res

    if (layouts && layouts.length) {
      layouts = layouts.sort((a, b) => {
        return b.split('/').length - a.split('/').length
      })
      for (const path of layouts) {
        const layout = this.LAYOUTS[path]
        if (layout) {
          res = await layout.default(c, { children: res, head, filename })
        }
      }
      return c.html(addDocType(res), status)
    }

    const defaultLayout = this.LAYOUTS[this.root + '/_layout.tsx']
    if (defaultLayout) {
      return c.html(
        addDocType(await defaultLayout.default(c, { children: res, head, filename })),
        status
      )
    }

    return c.html(res, status)
  }

  createApp = <E extends Env>(options?: { app?: Hono }): Hono<E> => {
    const app = options?.app ?? new Hono()

    for (const [dir, content] of Object.entries(this.routesMap)) {
      const subApp = new Hono()

      let layouts = this.layoutList[dir]

      const getLayoutPaths = (paths: string[]) => {
        layouts = this.layoutList[paths.join('/')]
        if (!layouts) {
          paths.pop()
          if (paths.length) {
            getLayoutPaths(paths)
          }
        }
      }

      if (!layouts) {
        const dirPaths = dir.split('/')
        getLayoutPaths(dirPaths)
      }

      for (const [filename, route] of Object.entries(content)) {
        const routeDefault = route.default
        if (!routeDefault) continue

        const path = filePathToPath(filename)
        const head = new Head()

        const options = {
          layouts,
          head,
          filename,
        }

        // Function Component
        if (typeof routeDefault === 'function') {
          subApp.get(path, (c) => {
            const res = routeDefault(c, { head })
            return this.toWebResponse(c, res, 200, options)
          })
        }

        for (const [method, handler] of Object.entries(routeDefault)) {
          if (method === 'APP') {
            const appHandler = routeDefault['APP']
            if (appHandler) {
              appHandler(subApp.use(path))
            }
          } else {
            if (handler) {
              subApp.on(method, path, async (c, next) => {
                const res = await (handler as Handler)(c, { head, next })
                return this.toWebResponse(c, res, 200, options)
              })
            }
          }
        }

        for (const [preservedDir, content] of Object.entries(this.preservedMap)) {
          if (dir !== this.root && dir === preservedDir) {
            const notFound = content[NOTFOUND_FILENAME]
            if (notFound) {
              const notFoundHandler = notFound.default as NotFoundHandler
              subApp.get('*', (c) =>
                this.toWebResponse(c, notFoundHandler(c, { head }), 404, options)
              )
            }
            const error = content[ERROR_FILENAME]
            if (error) {
              const errorHandler = error.default as ErrorHandler
              subApp.onError((error, c) =>
                this.toWebResponse(c, errorHandler(c, { error, head }), 500, options)
              )
            }
          }
        }

        const regExp = new RegExp(`^${this.root}`)
        app.route(dir.replace(regExp, ''), subApp)
      }
    }

    const head = new Head()

    if (this.preservedMap[this.root]) {
      const defaultNotFound = this.preservedMap[this.root][NOTFOUND_FILENAME]
      if (defaultNotFound) {
        const notFoundHandler = defaultNotFound.default as NotFoundHandler
        app.notFound((c) =>
          this.toWebResponse(c, notFoundHandler(c, { head }), 404, {
            head,
            filename: NOTFOUND_FILENAME,
          })
        )
      }

      const defaultError = this.preservedMap[this.root][ERROR_FILENAME]
      if (defaultError) {
        const errorHandler = defaultError.default as ErrorHandler
        app.onError((error, c) =>
          this.toWebResponse(c, errorHandler(c, { error, head }), 500, {
            head,
            filename: ERROR_FILENAME,
          })
        )
      }
    }

    return app as unknown as Hono<E>
  }
}
