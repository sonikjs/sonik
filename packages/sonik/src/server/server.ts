import type { Context, Env } from 'hono'
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
  CreateElement,
  FragmentType,
} from '../types.js'
import { filePathToPath, groupByDirectory, listByDirectory } from '../utils/index.js'
import { Head } from './head.js'

const NOTFOUND_FILENAME = '_404.tsx'
const ERROR_FILENAME = '_error.tsx'

export type ServerOptions<E extends Env = Env> = {
  PRESERVED?: Record<string, PreservedFile>
  LAYOUTS?: Record<string, LayoutFile>
  ROUTES?: Record<string, RouteFile>
  root?: string
  renderToString: RenderToString
  createElement: CreateElement
  fragment: FragmentType
  app?: Hono<E>
}

type RouteFile = { default: FC & Route }
type LayoutFile = { default: LayoutHandler }
type PreservedFile = { default: ErrorHandler | Handler }

type ToWebOptions = {
  head: Head
  layouts?: string[]
  filename: string
}

const addDocType = (html: string) => {
  return `<!doctype html>${html}`
}

export const createApp = <E extends Env>(options: ServerOptions<E>): Hono<E> => {
  const PRESERVED =
    options.PRESERVED ??
    import.meta.glob('/app/routes/**/(_error|_404).(tsx)', {
      eager: true,
    })

  const preservedMap = groupByDirectory(PRESERVED)

  const LAYOUTS =
    options.LAYOUTS ??
    import.meta.glob('/app/routes/**/_layout.tsx', {
      eager: true,
    })

  const layoutList = listByDirectory(LAYOUTS)

  const ROUTES =
    options.ROUTES ??
    import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(tsx|mdx)', {
      eager: true,
    })

  const routesMap = groupByDirectory(ROUTES)

  const root = options.root ?? '/app/routes'

  const render = options.renderToString

  const toWebResponse = async (
    c: Context,
    res: string | Promise<string> | Node | Promise<Node> | Response | Promise<Response>,
    status: number = 200,
    { layouts, head, filename }: ToWebOptions
  ) => {
    if (res instanceof Promise) res = await res
    if (res instanceof Response) return res

    if (layouts && layouts.length) {
      layouts = layouts.sort((a, b) => {
        return b.split('/').length - a.split('/').length
      })
      for (const path of layouts) {
        const layout = LAYOUTS[path]
        if (layout) {
          res = await layout.default(c, { children: res, head, filename })
        }
      }
      const html = render(res)
      return c.html(addDocType(html), status)
    }

    const defaultLayout = LAYOUTS[root + '/_layout.tsx']
    if (defaultLayout) {
      const html = render(await defaultLayout.default(c, { children: res, head, filename }))
      return c.html(addDocType(html), status)
    }

    const html = render(res)
    return c.html(html, status)
  }

  const app = options?.app ?? new Hono()

  for (const [dir, content] of Object.entries(routesMap)) {
    const subApp = new Hono()

    let layouts = layoutList[dir]

    const getLayoutPaths = (paths: string[]) => {
      layouts = layoutList[paths.join('/')]
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
      const head = new Head({
        createElement: options?.createElement,
        fragment: options?.fragment,
      })

      const resOptions = {
        layouts,
        head,
        filename,
      }

      // Function Component
      if (typeof routeDefault === 'function') {
        subApp.get(path, (c) => {
          const res = routeDefault(c, { head })
          return toWebResponse(c, res, 200, resOptions)
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
              return toWebResponse(c, res, 200, resOptions)
            })
          }
        }
      }

      for (const [preservedDir, content] of Object.entries(preservedMap)) {
        if (dir !== root && dir === preservedDir) {
          const notFound = content[NOTFOUND_FILENAME]
          if (notFound) {
            const notFoundHandler = notFound.default as NotFoundHandler
            subApp.get('*', (c) => toWebResponse(c, notFoundHandler(c, { head }), 404, resOptions))
          }
          const error = content[ERROR_FILENAME]
          if (error) {
            const errorHandler = error.default as ErrorHandler
            subApp.onError((error, c) =>
              toWebResponse(c, errorHandler(c, { error, head }), 500, resOptions)
            )
          }
        }
      }

      const regExp = new RegExp(`^${root}`)
      app.route(dir.replace(regExp, ''), subApp)
    }
  }

  const head = new Head({
    createElement: options?.createElement,
    fragment: options?.fragment,
  })

  if (preservedMap[root]) {
    const defaultNotFound = preservedMap[root][NOTFOUND_FILENAME]
    if (defaultNotFound) {
      const notFoundHandler = defaultNotFound.default as unknown as NotFoundHandler<E>
      app.notFound((c) =>
        toWebResponse(c, notFoundHandler(c, { head }), 404, {
          head,
          filename: NOTFOUND_FILENAME,
        })
      )
    }

    const defaultError = preservedMap[root][ERROR_FILENAME]
    if (defaultError) {
      const errorHandler = defaultError.default as unknown as ErrorHandler<E>
      app.onError((error, c) =>
        toWebResponse(c, errorHandler(c, { error, head }), 500, {
          head,
          filename: ERROR_FILENAME,
        })
      )
    }
  }

  return app as unknown as Hono<E>
}
