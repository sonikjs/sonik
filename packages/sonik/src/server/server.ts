import type { Context, Env } from 'hono'
import { Hono } from 'hono/quick'

import type { Route, ErrorHandler, Handler, FC, LayoutHandler, NotFoundHandler } from '../types'
import { Head } from './head'
import { filePathToPath, groupByDirectory, listByDirectory } from '../utils'
import { createHeadTag } from './head'

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

export class Server {
  readonly PRESERVED: Record<string, PreservedFile>
  readonly LAYOUTS: Record<string, LayoutFile>
  readonly preservedMap: PreservedMap
  readonly layoutList: LayoutList
  readonly routesMap: RouteMap
  readonly root: string

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
    head?: Head,
    layouts?: string[]
  ) => {
    if (res instanceof Promise) res = await res
    if (res instanceof Response) return res

    const addDocType = (html: string) => {
      return `<!doctype html>${html}`
    }

    if (layouts && layouts.length) {
      layouts = layouts.sort((a, b) => {
        return b.split('/').length - a.split('/').length
      })
      for (const path of layouts) {
        const layout = this.LAYOUTS[path]
        if (layout) {
          res = layout.default(res, createHeadTag(head))
        }
      }
      return c.html(addDocType(res), status)
    }

    const defaultLayout = this.LAYOUTS[this.root + '/_layout.tsx']
    if (defaultLayout) {
      return c.html(addDocType(defaultLayout.default(res, createHeadTag(head))), status)
    }

    return c.html(res, status)
  }

  createApp = <E extends Env>(options?: { app?: Hono }): Hono<E> => {
    const app = options?.app ?? new Hono()

    for (const [dir, content] of Object.entries(this.routesMap)) {
      const subApp = new Hono()

      let layoutPaths = this.layoutList[dir]

      const getLayoutPaths = (paths: string[]) => {
        layoutPaths = this.layoutList[paths.join('/')]
        if (!layoutPaths) {
          paths.pop()
          if (paths.length) {
            getLayoutPaths(paths)
          }
        }
      }

      if (!layoutPaths) {
        const dirPaths = dir.split('/')
        getLayoutPaths(dirPaths)
      }

      for (const [fileName, file] of Object.entries(content)) {
        const fileDefault = file.default
        if (!fileDefault) continue

        const path = filePathToPath(fileName)

        const head = new Head()

        if (typeof fileDefault === 'function') {
          subApp.get(path, (c) => {
            const res = fileDefault(c, head)
            return this.toWebResponse(c, res, 200, head, layoutPaths)
          })
        }

        for (const [method, handler] of Object.entries(fileDefault)) {
          if (method === 'APP') {
            const appHandler = fileDefault['APP']
            if (appHandler) {
              appHandler(subApp.use(path))
            }
          } else {
            if (handler) {
              subApp.on(method, path, async (c, next) => {
                const res = await handler(c, head, next)
                return this.toWebResponse(c, res, 200, head, layoutPaths)
              })
            }
          }
        }

        for (const [preservedDir, content] of Object.entries(this.preservedMap)) {
          if (dir !== this.root && dir === preservedDir) {
            const notFound = content['_404.tsx']
            if (notFound) {
              const notFoundHandler = notFound.default as NotFoundHandler
              subApp.get('*', (c) =>
                this.toWebResponse(c, notFoundHandler(c, head), 404, head, layoutPaths)
              )
            }
            const error = content['_error.tsx']
            if (error) {
              const errorHandler = error.default as ErrorHandler
              subApp.onError((e, c) =>
                this.toWebResponse(c, errorHandler(e, c, head), 500, head, layoutPaths)
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
      const defaultNotFound = this.preservedMap[this.root]['_404.tsx']
      if (defaultNotFound) {
        const notFoundHandler = defaultNotFound.default as NotFoundHandler
        app.notFound((c) => this.toWebResponse(c, notFoundHandler(c, head), 404, head))
      }

      const defaultError = this.preservedMap[this.root]['_error.tsx']
      if (defaultError) {
        const errorHandler = defaultError.default as ErrorHandler
        app.onError((e, c) => this.toWebResponse(c, errorHandler(e, c, head), 500, head))
      }
    }

    return app as unknown as Hono<E>
  }
}
