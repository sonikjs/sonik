/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from 'hono'
import type { Env, NotFoundHandler, ErrorHandler, MiddlewareHandler } from 'hono'
import type { H } from 'hono/types'
import { filePathToPath, groupByDirectory, listByDirectory, pathToDirPath } from '../utils/file.js'

const NOTFOUND_FILENAME = '_404.tsx'
const ERROR_FILENAME = '_error.tsx'
const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'] as const

export type ServerOptions<E extends Env = Env> = {
  ROUTES?: Record<string, RouteFile>
  root?: string
  app?: Hono<E>
}

type AppFile = { default: Hono }
type RouteFile = {
  default?: Function
} & { [M in (typeof METHODS)[number]]?: H[] }
type RendererFile = { default: MiddlewareHandler }
type NotFoundFile = { default: NotFoundHandler }
type ErrorFile = { default: ErrorHandler }

export const createApp = <E extends Env>(options?: ServerOptions<E>): Hono<E> => {
  const root = options?.root ?? '/app/routes'
  const rootRegExp = new RegExp(`^${root}`)
  const app = options?.app ?? new Hono()

  // Not Found
  const NOT_FOUND_FILE = import.meta.glob<NotFoundFile>('/app/routes/**/_404.(ts|tsx)', {
    eager: true,
  })
  const notFoundMap = groupByDirectory(NOT_FOUND_FILE)

  // Error
  const ERROR_FILE = import.meta.glob<ErrorFile>('/app/routes/**/_error.(ts|tsx)', {
    eager: true,
  })
  const errorMap = groupByDirectory(ERROR_FILE)

  // Renderer
  const RENDERER_FILE = import.meta.glob<RendererFile>('/app/routes/**/_renderer.tsx', {
    eager: true,
  })
  const rendererList = listByDirectory(RENDERER_FILE)
  const applyRenderer = (app: Hono, rendererFile: string) => {
    const renderer = RENDERER_FILE[rendererFile]
    const path = pathToDirPath(rendererFile).replace(rootRegExp, '')
    app.get(`${path}*`, renderer.default)
  }

  // Routes
  const ROUTES_FILE =
    options?.ROUTES ??
    import.meta.glob<RouteFile | AppFile>('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(ts|tsx|mdx)', {
      eager: true,
    })
  const routesMap = groupByDirectory(ROUTES_FILE)

  for (const [dir, content] of Object.entries(routesMap)) {
    const subApp = new Hono()

    // Renderer
    let rendererFiles = rendererList[dir]

    if (rendererFiles) {
      applyRenderer(subApp, rendererFiles[0])
    }

    if (!rendererFiles) {
      const dirPaths = dir.split('/')
      const getRendererPaths = (paths: string[]) => {
        rendererFiles = rendererList[paths.join('/')]
        if (!rendererFiles) {
          paths.pop()
          if (paths.length) {
            getRendererPaths(paths)
          }
        }
        return rendererFiles
      }
      rendererFiles = getRendererPaths(dirPaths)
      applyRenderer(subApp, rendererFiles[0])
    }

    // Root path
    let rootPath = dir.replace(rootRegExp, '')
    rootPath = filePathToPath(rootPath)

    for (const [filename, route] of Object.entries(content)) {
      const routeDefault = route.default
      const path = filePathToPath(filename)

      // Instance of Hono
      if (routeDefault && 'fetch' in routeDefault) {
        subApp.route(path, routeDefault)
        continue
      }

      // export const POST = factory.createHandlers(...)
      for (const m of METHODS) {
        const handlers = (route as Record<string, H[]>)[m]
        if (handlers) {
          subApp.on(m, path, ...handlers)
        }
      }

      // export default factory.createHandlers(...)
      if (routeDefault && Array.isArray(routeDefault)) {
        subApp.get(path, ...(routeDefault as H[]))
      }

      // Not Found
      applyNotFound(subApp, root, dir, notFoundMap)
      // Error
      applyError(subApp, root, dir, errorMap)
    }
    app.route(rootPath, subApp)
  }

  return app
}

function applyNotFound(
  app: Hono,
  root: string,
  dir: string,
  map: Record<string, Record<string, NotFoundFile>>
) {
  for (const [mapDir, content] of Object.entries(map)) {
    if (dir !== root && dir === mapDir) {
      const notFound = content[NOTFOUND_FILENAME]
      if (notFound) {
        const notFoundHandler = notFound.default
        app.get('*', (c) => {
          c.status(404)
          return notFoundHandler(c)
        })
      }
    }
  }
}

function applyError(
  app: Hono,
  root: string,
  dir: string,
  map: Record<string, Record<string, ErrorFile>>
) {
  for (const [mapDir, content] of Object.entries(map)) {
    if (dir !== root && dir === mapDir) {
      const error = content[ERROR_FILENAME]
      if (error) {
        const errorHandler = error.default
        app.onError((error, c) => {
          c.status(500)
          return (async () => {
            c.status(500)
            return errorHandler(error, c)
          })()
        })
      }
    }
  }
}
