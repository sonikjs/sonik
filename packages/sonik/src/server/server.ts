/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Env } from 'hono'
import { Hono } from 'hono'
import type {
  ErrorHandler,
  FC,
  Handler,
  Node,
  LayoutHandler,
  NotFoundHandler,
  Route,
  RenderToString,
  RenderToReadableStream,
  CreateElement,
  FragmentType,
} from '../types.js'
import { filePathToPath, groupByDirectory, listByDirectory } from '../utils/file.js'
import { Head } from './head.js'

const NOTFOUND_FILENAME = '_404.tsx'
const ERROR_FILENAME = '_error.tsx'

export type ServerOptions<E extends Env = Env> = {
  PRESERVED?: Record<string, PreservedFile>
  LAYOUTS?: Record<string, LayoutFile>
  NESTED_LAYOUTS?: Record<string, LayoutFile>
  ROUTES?: Record<string, RouteFile>
  root?: string
  renderToString: RenderToString
  renderToReadableStream?: RenderToReadableStream
  createElement: CreateElement
  fragment: FragmentType
  createHead?: () => Head
  streaming?: boolean
  app?: Hono<E>
}

type RouteFile = { default: FC & Route & Hono }
type LayoutFile = { default: LayoutHandler }
type PreservedFile = { default: ErrorHandler | Handler }

type ToWebOptions = {
  head: Head
  layouts?: string[]
  nestedLayouts?: string[]
  filename: string
}

const addDocType = (html: string) => {
  return `<!doctype html>${html}`
}

export const createApp = <E extends Env>(options: ServerOptions<E>): Hono<E> => {
  const PRESERVED =
    options.PRESERVED ??
    import.meta.glob('/app/routes/**/(_error|_404).(ts|tsx)', {
      eager: true,
    })

  const preservedMap = groupByDirectory(PRESERVED)

  const LAYOUTS =
    options.LAYOUTS ??
    import.meta.glob('/app/routes/**/_layout.tsx', {
      eager: true,
    })

  const NESTED_LAYOUTS =
    options.NESTED_LAYOUTS ??
    import.meta.glob('/app/routes/**/__layout.tsx', {
      eager: true,
    })

  const layoutList = listByDirectory(LAYOUTS)
  const nestedLayoutList = listByDirectory(NESTED_LAYOUTS)

  const ROUTES =
    options.ROUTES ??
    import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(ts|tsx|mdx)', {
      eager: true,
    })

  const routesMap = groupByDirectory(ROUTES)

  const root = options.root ?? '/app/routes'

  const render =
    options.streaming && options.renderToReadableStream
      ? options.renderToReadableStream
      : options.renderToString

  const returnHtml = async (res: any, status: number) => {
    const contentType = 'text/html; charset=utf-8'
    if (typeof res === 'string') {
      return new Response(res, {
        status,
        headers: {
          'Content-Type': contentType,
        },
      })
    } else {
      return new Response(await res, {
        status,
        headers: {
          'Transfer-Encoding': 'chunked',
          'X-Content-Type-Options': 'nosniff',
          'Content-Type': contentType,
        },
      })
    }
  }

  const toWebResponse = async (
    res: string | Promise<string> | Node | Promise<Node> | Response | Promise<Response>,
    status: number = 200,
    { layouts, head, filename, nestedLayouts }: ToWebOptions
  ) => {
    if (res instanceof Promise) res = await res
    if (res instanceof Response) return res

    if (nestedLayouts && nestedLayouts.length) {
      nestedLayouts = nestedLayouts.sort((a, b) => {
        return b.split('/').length - a.split('/').length
      })
      for (const path of nestedLayouts) {
        const layout = NESTED_LAYOUTS[path]
        if (layout) {
          try {
            res = await layout.default({ children: res, head, filename })
          } catch (e) {
            console.trace(e)
          }
        }
      }
    }

    let defaultLayout: LayoutFile | undefined
    if (layouts && layouts.length) {
      layouts = layouts.sort((a, b) => {
        return b.split('/').length - a.split('/').length
      })
      defaultLayout = LAYOUTS[layouts[0]]
    }

    defaultLayout ??= LAYOUTS[root + '/_layout.tsx']

    if (defaultLayout) {
      try {
        res = await defaultLayout.default({ children: res, head, filename })
      } catch (e) {
        console.trace(e)
      }
      const html = render(res)
      return returnHtml(typeof html === 'string' ? addDocType(html) : html, status)
    }

    const html = render(res)
    return returnHtml(html, status)
  }

  const app = options.app ?? new Hono()

  for (const [dir, content] of Object.entries(routesMap)) {
    const subApp = new Hono()

    let layouts = layoutList[dir]
    let nestedLayouts = nestedLayoutList[dir]

    const dirPaths = dir.split('/')

    if (!layouts) {
      const getLayoutPaths = (paths: string[]) => {
        layouts = layoutList[paths.join('/')]
        if (!layouts) {
          paths.pop()
          if (paths.length) {
            getLayoutPaths(paths)
          }
        }
      }
      getLayoutPaths(dirPaths)
    }

    if (!nestedLayouts) {
      const getLayoutPaths = (paths: string[]) => {
        nestedLayouts = nestedLayoutList[paths.join('/')]
        if (!nestedLayouts) {
          paths.pop()
          if (paths.length) {
            getLayoutPaths(paths)
          }
        }
      }
      getLayoutPaths(dirPaths)
    }

    const regExp = new RegExp(`^${root}`)
    let rootPath = dir.replace(regExp, '')
    rootPath = filePathToPath(rootPath)

    for (const [filename, route] of Object.entries(content)) {
      const routeDefault = route.default
      if (!routeDefault) continue

      const path = filePathToPath(filename)

      // Instance of Hono
      if ('fetch' in routeDefault) {
        subApp.route(path, routeDefault)
        continue
      }

      let head: Head
      if (options.createHead) {
        head = options.createHead()
      } else {
        head = new Head({
          createElement: options.createElement,
          fragment: options.fragment,
        })
      }

      const resOptions = {
        layouts,
        nestedLayouts,
        head,
        filename,
      }

      // Function Component
      if (typeof routeDefault === 'function') {
        subApp.get(path, (c) => {
          const res = (routeDefault as FC)(c, { head })
          return toWebResponse(res, 200, resOptions)
        })
      }

      // export default {} satisfies Route
      for (const [method, handler] of Object.entries(routeDefault)) {
        if (method === 'APP') {
          const appHandler = (routeDefault as Route)['APP']
          if (appHandler) {
            appHandler(subApp.use(path), {
              head,
              render: (node, status) => {
                return toWebResponse(node, status, resOptions)
              },
            })
          }
        } else {
          if (handler) {
            subApp.on(method, path, async (c, next) => {
              const res = await (handler as Handler)(c, { head, next })
              return toWebResponse(res, 200, resOptions)
            })
          }
        }
      }

      for (const [preservedDir, content] of Object.entries(preservedMap)) {
        if (dir !== root && dir === preservedDir) {
          const notFound = content[NOTFOUND_FILENAME]
          if (notFound) {
            const notFoundHandler = notFound.default as NotFoundHandler
            subApp.get('*', (c) => toWebResponse(notFoundHandler(c, { head }), 404, resOptions))
          }
          const error = content[ERROR_FILENAME]
          if (error) {
            const errorHandler = error.default as ErrorHandler
            subApp.onError((error, c) =>
              toWebResponse(errorHandler(c, { error, head }), 500, resOptions)
            )
          }
        }
      }
    }
    app.route(rootPath, subApp)
  }

  let head: Head
  if (options.createHead) {
    head = options.createHead()
  } else {
    head = new Head({
      createElement: options.createElement,
      fragment: options.fragment,
    })
  }

  if (preservedMap[root]) {
    const defaultNotFound = preservedMap[root][NOTFOUND_FILENAME]
    if (defaultNotFound) {
      const notFoundHandler = defaultNotFound.default as unknown as NotFoundHandler<E>
      app.notFound((c) =>
        toWebResponse(notFoundHandler(c, { head }), 404, {
          head,
          filename: NOTFOUND_FILENAME,
        })
      )
    }

    const defaultError = preservedMap[root][ERROR_FILENAME]
    if (defaultError) {
      const errorHandler = defaultError.default as unknown as ErrorHandler<E>
      app.onError((error, c) =>
        toWebResponse(errorHandler(c, { error, head }), 500, {
          head,
          filename: ERROR_FILENAME,
        })
      )
    }
  }

  return app as unknown as Hono<E>
}
